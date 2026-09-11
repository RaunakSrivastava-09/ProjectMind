"use client";

export default function SnagList({ snags = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl">
   
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Project Issues
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Snags
          </h3>
        </div>

        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
          {snags.length}{" "}
          {snags.length === 1 ? "snag" : "snags"}
        </span>
      </div>

     
      {snags.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <div className="mb-3 text-3xl">
            ✅
          </div>

          <p className="text-sm font-medium text-gray-300">
            No snags found
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Say "Create a snag..." to report an issue.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {snags.map((snag) => (
            <SnagItem
              key={snag._id}
              snag={snag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SnagItem({ snag }) {
  const status = snag.status || "open";

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20">
      <div className="flex items-start gap-3">
        {/* Issue indicator */}
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm">
          ⚠️
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h4 className="font-medium text-white">
              {snag.title}
            </h4>

            <StatusBadge status={status} />
          </div>

          {snag.description && (
            <p className="mt-1 text-sm leading-5 text-gray-400">
              {snag.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
            {snag.location && (
              <span>
                📍 {snag.location}
              </span>
            )}

            {snag.assignee && (
              <span>
                👤 {snag.assignee}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
  };

  return (
    <span
      className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs ${
        status === "resolved"
          ? "bg-green-500/10 text-green-400"
          : status === "in-progress"
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}