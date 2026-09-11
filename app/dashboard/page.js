"use client";

import { useEffect, useState } from "react";

import VoiceCommand from "@/components/VoiceCommand";
import ProjectCard from "@/components/ProjectCard";
import TaskList from "@/components/TaskList";
import SnagList from "@/components/SnagList";

export default function DashboardPage() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [snags, setSnags] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  async function initializeDashboard() {
    try {
     
      const response = await fetch("/api/voice", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: "Give me the project status.",
        }),
      });

      const data = await response.json();

      if (data.projectId) {
        const projectData = {
          _id: data.projectId,
          name: "Green Heights Construction",
          description:
            "Demo construction project powered by ProjectMind.",
          status: "active",
        };

        setProject(projectData);
      }

     
      await loadProjectData();
    } catch (error) {
      console.error(
        "Dashboard initialization error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectData() {
    try {
      const [tasksResponse, snagsResponse] =
        await Promise.all([
          fetch("/api/voice", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              text: "Show me all tasks.",
            }),
          }),

          fetch("/api/voice", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              text: "Show me all snags.",
            }),
          }),
        ]);

      const tasksData =
        await tasksResponse.json();

      const snagsData =
        await snagsResponse.json();

      if (Array.isArray(tasksData.data)) {
        setTasks(tasksData.data);
      }

      if (Array.isArray(snagsData.data)) {
        setSnags(snagsData.data);
      }

    
      if (tasksData.projectId || snagsData.projectId) {
        setProject((previous) => ({
          ...(previous || {}),
          _id:
            tasksData.projectId ||
            snagsData.projectId,
          name:
            previous?.name ||
            "Green Heights Construction",
          description:
            previous?.description ||
            "Demo construction project powered by ProjectMind.",
          status:
            previous?.status ||
            "active",
        }));
      }
    } catch (error) {
      console.error(
        "Unable to load project data:",
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold">
              P
            </div>

            <div>
              <p className="font-bold text-white">
                ProjectMind
              </p>

              <p className="hidden text-[10px] uppercase tracking-widest text-gray-500 sm:block">
                AI Project Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-500 sm:inline">
              AI-powered workspace
            </span>

            <div className="h-2 w-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
          </div>
        </div>
      </nav>

      <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
       
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            PROJECT WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Talk to your project.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
            Create tasks, report snags, search project
            information, and check project status using
            natural language.
          </p>
        </div>

      
        {loading ? (
          <div className="mb-8 h-36 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ) : (
          <div className="mb-8">
            <ProjectCard project={project} />
          </div>
        )}

      
        <section>
          <VoiceCommand />
        </section>

     
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Project data
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Live project workspace
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TaskList tasks={tasks} />

            <SnagList snags={snags} />
          </div>
        </section>

      
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Hackathon demo
          </p>

          <h2 className="mt-2 text-lg font-bold text-white">
            Commands to demonstrate
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <DemoCommand
              number="01"
              text="Create a snag for the master bathroom ceiling and assign it to the false-ceiling contractor."
            />

            <DemoCommand
              number="02"
              text="Show me all open snags."
            />

            <DemoCommand
              number="03"
              text="Create a task to inspect electrical wiring and assign it to Rahul."
            />

            <DemoCommand
              number="04"
              text="Give me the project status."
            />
          </div>
        </section>

      
        <footer className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-600">
            ProjectMind — Less clicking. More doing.
          </p>
        </footer>
      </div>
    </main>
  );
}

function DemoCommand({ number, text }) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
      <span className="text-xs font-mono text-blue-500">
        {number}
      </span>

      <p className="text-sm leading-6 text-gray-400">
        "{text}"
      </p>
    </div>
  );
}