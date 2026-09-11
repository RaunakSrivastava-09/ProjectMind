import { z } from "zod";

export const commandSchema = z.object({
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

export function normalizeCommand(text) {
  return text
    .trim()
    .replace(/\s+/g, " ");
}