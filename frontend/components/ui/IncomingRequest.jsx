import { useState } from "react";
import { Check, X, UserRound, RefreshCw } from "lucide-react";
import { useIncomingRequests } from "../../src/hooks/queries/useIncomingRequests";
import { useRespondConnectionRequest } from "../../src/hooks/mutuations/useRespondeConnectionRequest";

const getErrorMessage = (error) => error?.message || "";

export default function IncomingRequests() {
  const [success, setSuccess] = useState("");

  const {
    data: requests = [],
    isLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useIncomingRequests();

  const {
    mutate: respond,
    isPending: responding,
    variables,
    error: respondError,
    reset: resetRespond,
  } = useRespondConnectionRequest();

  const processingId = responding ? variables?.connectionId : null;
  const errorMessage =
    getErrorMessage(fetchError) || getErrorMessage(respondError);

  const handleResponse = (connectionId, status) => {
    if (!connectionId) return;

    setSuccess("");
    resetRespond();

    respond(
      { connectionId, status },
      {
        onSuccess: () =>
          setSuccess(
            status === "accepted"
              ? "Connection request accepted."
              : "Connection request rejected."
          ),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading incoming requests...
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Connection Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your incoming requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh requests"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <UserRound size={36} className="mx-auto mb-3 text-slate-400" />
          <h3 className="font-medium text-slate-800">No incoming requests</h3>
          <p className="mt-1 text-sm text-slate-500">
            New connection requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const connectionId = request.id ?? request.connectionId;
            const sender = request.requester ?? request.sender ?? request.user;

            return (
              <div
                key={connectionId}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                    <UserRound size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {sender?.name || sender?.username || "Unknown user"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {sender?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleResponse(connectionId, "accepted")}
                    disabled={responding || !connectionId}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:flex-none"
                  >
                    <Check size={16} />
                    {processingId === connectionId ? "Please wait..." : "Accept"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResponse(connectionId, "rejected")}
                    disabled={responding || !connectionId}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}