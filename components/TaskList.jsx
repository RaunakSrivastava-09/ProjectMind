"use client";

export default function TaskList({ tasks = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl">
    
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Project Tasks
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Tasks
          </h3>
        </div>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {tasks.length}{" "}
          {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

    
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <div className="mb-3 text-3xl">
            📋
          </div>

          <p className="text-sm font-medium text-gray-300">
            No tasks yet
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Say "Create a task..." to add one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task }) {
  const status = task.status || "open";

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20">
      <div className="flex items-start gap-3">
      
        <div
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            status === "completed"
              ? "bg-green-400"
              : status === "in-progress"
              ? "bg-yellow-400"
              : "bg-blue-400"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h4 className="font-medium text-white">
              {task.title}
            </h4>

            <StatusBadge status={status} />
          </div>

          {task.description && (
            <p className="mt-1 text-sm leading-5 text-gray-400">
              {task.description}
            </p>
          )}

          {task.assignee && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span>👤</span>
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    open: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <span
      className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs ${
        status === "completed"
          ? "bg-green-500/10 text-green-400"
          : status === "in-progress"
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-blue-500/10 text-blue-400"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}