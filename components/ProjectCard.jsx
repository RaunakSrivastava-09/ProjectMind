"use client";

export default function ProjectCard({ project }) {
  if (!project) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm text-gray-500">
          No project selected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Current Project
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            {project.name}
          </h3>

          {project.description && (
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {project.description}
            </p>
          )}
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium capitalize text-green-400">
          {project.status || "active"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-gray-400">
          🎙️ Voice Enabled
        </span>

        <span className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-gray-400">
          🤖 AI Commands
        </span>

        <span className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-gray-400">
          🗄️ MongoDB
        </span>
      </div>
    </div>
  );
}