"use client";

export default function CommandResult({ result }) {
  if (!result) return null;

  const isSuccess = result.success;

  const command = result.command;
  const data = result.data;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isSuccess
          ? "border-green-500/20"
          : "border-red-500/20"
      } bg-white/[0.03]`}
    >
     
      <div className="flex items-start gap-4 p-5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSuccess
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            ProjectMind
          </p>

          <p
            className={`mt-1 text-sm leading-6 ${
              isSuccess
                ? "text-gray-200"
                : "text-red-300"
            }`}
          >
            {result.message}
          </p>
        </div>
      </div>

  
      {command && (
        <div className="border-t border-white/10 p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
            AI understood
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              label="Intent"
              value={formatIntent(command.intent)}
            />

            {command.title && (
              <InfoItem
                label="Title"
                value={command.title}
              />
            )}

            {command.location && (
              <InfoItem
                label="Location"
                value={command.location}
              />
            )}

            {command.assignee && (
              <InfoItem
                label="Assignee"
                value={command.assignee}
              />
            )}

            {command.status && (
              <InfoItem
                label="Status"
                value={command.status}
              />
            )}

            {command.searchQuery && (
              <InfoItem
                label="Search"
                value={command.searchQuery}
              />
            )}
          </div>
        </div>
      )}

    
      {data && !Array.isArray(data) && data.title && (
        <div className="border-t border-white/10 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Created
          </p>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="font-medium text-white">
              {data.title}
            </p>

            {data.description && (
              <p className="mt-1 text-sm text-gray-400">
                {data.description}
              </p>
            )}

            {data.location && (
              <p className="mt-3 text-xs text-gray-500">
                📍 {data.location}
              </p>
            )}

            {data.assignee && (
              <p className="mt-1 text-xs text-gray-500">
                👤 {data.assignee}
              </p>
            )}

            {data.status && (
              <span className="mt-3 inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
                {data.status}
              </span>
            )}
          </div>
        </div>
      )}

   
      {Array.isArray(data) && (
        <div className="border-t border-white/10 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Results
          </p>

          {data.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-center">
              <p className="text-sm text-gray-500">
                No matching records found.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-sm text-gray-400">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.status && (
                      <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                        {item.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                    {item.location && (
                      <span>
                        📍 {item.location}
                      </span>
                    )}

                    {item.assignee && (
                      <span>
                        👤 {item.assignee}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    
      {data &&
        !Array.isArray(data) &&
        typeof data.totalTasks === "number" && (
          <div className="border-t border-white/10 p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
              Project overview
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard
                label="Total Tasks"
                value={data.totalTasks}
              />

              <StatCard
                label="Open Tasks"
                value={data.openTasks}
              />

              <StatCard
                label="Completed"
                value={data.completedTasks}
              />

              <StatCard
                label="Total Snags"
                value={data.totalSnags}
              />

              <StatCard
                label="Open Snags"
                value={data.openSnags}
              />

              <StatCard
                label="Resolved"
                value={data.resolvedSnags}
              />
            </div>
          </div>
        )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-sm text-gray-300">
        {value}
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function formatIntent(intent) {
  if (!intent) return "Unknown";

  const labels = {
    CREATE_SNAG: "Create Snag",
    CREATE_TASK: "Create Task",
    SEARCH_SNAGS: "Search Snags",
    SEARCH_TASKS: "Search Tasks",
    PROJECT_STATUS: "Project Status",
    UNKNOWN: "Unknown",
  };

  return labels[intent] || intent;
}