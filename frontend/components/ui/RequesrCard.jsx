
import { Check, X, UserRound } from "lucide-react";
import Avatar from "../../components/ui/Avator";

export default function RequestCard({
  request,
  onAccept,
  onReject,
  loading = false,
}) {
  const user = request?.sender || request?.from || request?.user || {};

  const name = user.name || user.username || "Unknown User";
  const email = user.email || "";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={name} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {name}
          </h3>

          <p className="truncate text-sm text-slate-500">
            {email}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Wants to connect with you
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onAccept(request)}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          <Check size={16} />
          Accept
        </button>

        <button
          type="button"
          onClick={() => onReject(request)}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          <X size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}
