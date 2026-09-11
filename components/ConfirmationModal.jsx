"use client";

export default function ConfirmationModal({
  command,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!command) return null;

  const isSnag = command.intent === "CREATE_SNAG";

  const actionName = isSnag
    ? "Create Snag"
    : "Create Task";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#111318] shadow-2xl">
       
        <div className="border-b border-white/10 p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
              ⚠️
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Confirm action
              </h2>

              <p className="text-sm text-gray-500">
                ProjectMind is ready to make this change.
              </p>
            </div>
          </div>
        </div>

      
        <div className="space-y-4 p-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Action
            </p>

            <div className="inline-flex rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400">
              {actionName}
            </div>
          </div>

         
          {command.title && (
            <div>
              <p className="mb-1 text-xs text-gray-500">
                Title
              </p>

              <p className="text-sm font-medium text-white">
                {command.title}
              </p>
            </div>
          )}

         
          {command.description && (
            <div>
              <p className="mb-1 text-xs text-gray-500">
                Description
              </p>

              <p className="text-sm leading-6 text-gray-300">
                {command.description}
              </p>
            </div>
          )}

       
          {command.location && (
            <div>
              <p className="mb-1 text-xs text-gray-500">
                Location
              </p>

              <p className="text-sm text-gray-300">
                📍 {command.location}
              </p>
            </div>
          )}

         
          {command.assignee && (
            <div>
              <p className="mb-1 text-xs text-gray-500">
                Assigned to
              </p>

              <p className="text-sm text-gray-300">
                👤 {command.assignee}
              </p>
            </div>
          )}

         
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-xs leading-5 text-yellow-300/80">
              This action will modify the project data.
              Please verify the details before confirming.
            </p>
          </div>
        </div>

       
        <div className="flex gap-3 border-t border-white/10 p-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Executing..."
              : `Confirm ${isSnag ? "Snag" : "Task"}`}
          </button>
        </div>
      </div>
    </div>
  );
}