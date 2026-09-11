import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import groq from "@/lib/groq";

import Project from "@/models/Project";
import Task from "@/models/Task";
import Snag from "@/models/Snag";

import { commandSchema, normalizeCommand } from "@/utils/commandParser";

const AICommandSchema = z.object({
  intent: z.enum([
    "CREATE_SNAG",
    "CREATE_TASK",
    "SEARCH_SNAGS",
    "SEARCH_TASKS",
    "PROJECT_STATUS",
    "UNKNOWN",
  ]),

  title: z.string().nullable(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  assignee: z.string().nullable(),
  status: z.string().nullable(),
  searchQuery: z.string().nullable(),
});

async function understandCommand(text) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    temperature: 0,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: `
You are the command-understanding engine for ProjectMind,
an AI voice assistant for project management software.

Your job is to convert natural language into a structured command.

Supported intents:

1. CREATE_SNAG
Use when the user wants to report, create, add, or log a snag,
issue, defect, problem, or incomplete work.

2. CREATE_TASK
Use when the user wants to create, add, assign, or schedule a task.

3. SEARCH_SNAGS
Use when the user wants to find, show, list, search, or retrieve snags.

4. SEARCH_TASKS
Use when the user wants to find, show, list, search, or retrieve tasks.

5. PROJECT_STATUS
Use when the user asks about project progress, project status,
open work, overall project health, or summary.

6. UNKNOWN
Use when the command does not fit any supported intent.

Extract these fields:

title:
Short title for the task or snag.
Use null when unavailable.

description:
Useful description of the requested work or issue.
Use null when unavailable.

location:
Physical/project location such as "Master Bathroom Ceiling".
Use null when unavailable.

assignee:
Person, contractor, team, or role responsible.
Use null when unavailable.

status:
Requested status such as "open", "completed", "in-progress".
Use null when unavailable.

searchQuery:
Important keywords for a search.
Use null when unavailable.

Rules:

- Understand natural language.
- Do not invent information.
- Preserve names and locations from the user's command.
- If the user says "false-ceiling contractor", preserve that wording.
- If the user asks for "open snags", set intent to SEARCH_SNAGS
  and status to "open".
- If the user asks "show all snags", use SEARCH_SNAGS.
- If the user asks "show my tasks", use SEARCH_TASKS.
- If the user asks "how is the project doing?", use PROJECT_STATUS.
- For CREATE_SNAG, title should summarize the issue.
- For CREATE_TASK, title should summarize the task.

Return ONLY valid JSON in this format:

{
  "intent": "CREATE_SNAG",
  "title": "Ceiling finishing incomplete",
  "description": "Ceiling finishing is incomplete",
  "location": "Master Bathroom Ceiling",
  "assignee": "False-ceiling Contractor",
  "status": null,
  "searchQuery": null
}
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI did not return a command");
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error("Invalid AI JSON:", content);
    throw new Error("AI returned invalid command data");
  }

  return AICommandSchema.parse(parsed);
}

async function getOrCreateDemoProject() {
  let project = await Project.findOne({
    name: "Green Heights Construction",
  });

  if (!project) {
    project = await Project.create({
      name: "Green Heights Construction",
      description:
        "Demo construction project for ProjectMind hackathon.",
      status: "active",
    });
  }

  return project;
}

function requiresConfirmation(command) {
  return (
    command.intent === "CREATE_SNAG" ||
    command.intent === "CREATE_TASK"
  );
}

async function executeCommand(command, projectId) {
  if (command.intent === "CREATE_SNAG") {
    const snag = await Snag.create({
      title:
        command.title ||
        "New Project Snag",

      description:
        command.description ||
        "",

      location:
        command.location ||
        "",

      assignee:
        command.assignee ||
        "",

      status: "open",

      projectId,
    });

    return {
      success: true,
      message: `Snag created successfully${
        command.assignee
          ? ` and assigned to ${command.assignee}`
          : ""
      }.`,
      data: snag,
    };
  }

  if (command.intent === "CREATE_TASK") {
    const task = await Task.create({
      title:
        command.title ||
        "New Project Task",

      description:
        command.description ||
        "",

      assignee:
        command.assignee ||
        "",

      status: "open",

      projectId,
    });

    return {
      success: true,
      message: `Task created successfully${
        command.assignee
          ? ` and assigned to ${command.assignee}`
          : ""
      }.`,
      data: task,
    };
  }

  if (command.intent === "SEARCH_SNAGS") {
    const filter = {
      projectId,
    };

    if (command.status) {
      filter.status = command.status;
    }

    if (command.searchQuery) {
      filter.$or = [
        {
          title: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
        {
          description: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
        {
          location: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
        {
          assignee: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
      ];
    }

    const snags = await Snag.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return {
      success: true,

      message:
        snags.length > 0
          ? `I found ${snags.length} snag${
              snags.length === 1 ? "" : "s"
            }.`
          : "I couldn't find any matching snags.",

      data: snags,
    };
  }

  if (command.intent === "SEARCH_TASKS") {
    const filter = {
      projectId,
    };

    if (command.status) {
      filter.status = command.status;
    }

    if (command.searchQuery) {
      filter.$or = [
        {
          title: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
        {
          description: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
        {
          assignee: {
            $regex: command.searchQuery,
            $options: "i",
          },
        },
      ];
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return {
      success: true,

      message:
        tasks.length > 0
          ? `I found ${tasks.length} task${
              tasks.length === 1 ? "" : "s"
            }.`
          : "I couldn't find any matching tasks.",

      data: tasks,
    };
  }

  if (command.intent === "PROJECT_STATUS") {
    const [
      totalTasks,
      openTasks,
      completedTasks,
      totalSnags,
      openSnags,
      resolvedSnags,
    ] = await Promise.all([
      Task.countDocuments({
        projectId,
      }),

      Task.countDocuments({
        projectId,
        status: "open",
      }),

      Task.countDocuments({
        projectId,
        status: "completed",
      }),

      Snag.countDocuments({
        projectId,
      }),

      Snag.countDocuments({
        projectId,
        status: "open",
      }),

      Snag.countDocuments({
        projectId,
        status: "resolved",
      }),
    ]);

    return {
      success: true,

      message: `The project has ${totalTasks} tasks and ${totalSnags} snags. ${openTasks} tasks are open and ${openSnags} snags are open.`,

      data: {
        totalTasks,
        openTasks,
        completedTasks,
        totalSnags,
        openSnags,
        resolvedSnags,
      },
    };
  }

  return {
    success: false,

    message:
      "I couldn't understand that command. Try creating a task, creating a snag, searching project items, or asking for project status.",

    data: null,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      text,
      projectId: requestedProjectId,
      execute = false,
      confirmedCommand = null,
    } = body;

    if (!text && !confirmedCommand) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a command.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

   
    let project;

    if (requestedProjectId) {
      project = await Project.findById(requestedProjectId);

      if (!project) {
        return NextResponse.json(
          {
            success: false,
            message: "Project not found.",
          },
          {
            status: 404,
          }
        );
      }
    } else {
      project = await getOrCreateDemoProject();
    }

    let command;

   
    if (execute && confirmedCommand) {
      command = commandSchema.parse(confirmedCommand);
    } else {
      const normalizedText = normalizeCommand(text);

      command = await understandCommand(normalizedText);
    }

   
    if (!execute && requiresConfirmation(command)) {
      return NextResponse.json({
        success: true,

        requiresConfirmation: true,

        message:
          "I understood the command. Please confirm before I make this change.",

        command,

        projectId: project._id.toString(),
      });
    }

    
    const result = await executeCommand(
      command,
      project._id
    );

    return NextResponse.json({
      ...result,

      requiresConfirmation: false,

      command,

      projectId: project._id.toString(),
    });
  } catch (error) {
    console.error("ProjectMind API error:", error);

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Something went wrong while processing your command.",
      },
      {
        status: 500,
      }
    );
  }
}