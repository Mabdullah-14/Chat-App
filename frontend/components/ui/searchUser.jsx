import { useState } from "react";
import { X, Mail, UserPlus } from "lucide-react";
import { useSearchUser } from "../../src/hooks/queries/useSearchUser";
import { useSendConnectionRequest } from "../../src/hooks/mutuations/useSendConnectionRequest";

const getErrorMessage = (error) => error?.message || "";

export default function SearchUser({ onClose }) {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const {
    data: user,
    isFetching: loading,
    error: searchError,
  } = useSearchUser(searchedEmail);

  const {
    mutate: sendRequest,
    isPending: sending,
    isSuccess,
    error: sendError,
    reset: resetSend,
  } = useSendConnectionRequest();

  const errorMessage =
    getErrorMessage(searchError) || getErrorMessage(sendError);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    resetSend();
    setSearchedEmail(trimmed);
  };

  const handleSendRequest = () => {
    if (!user?.id) return;

    sendRequest(user.id, {
      onSuccess: () => {
        setSearchedEmail("");
        setEmail("");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40" />

      <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Connection
              </h2>
              <p className="text-sm text-slate-500">Add someone by email</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <label
            htmlFor="connection-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
            <Mail size={18} className="shrink-0 text-slate-400" />

            <input
              id="connection-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email"
              required
              className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search User"}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
        )}

        {isSuccess && (
          <p className="mt-4 text-sm text-green-600">
            Connection request sent successfully!
          </p>
        )}

        {user && (
          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">
              {user.name || user.username || "User"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">{user.email}</p>

            <button
              type="button"
              onClick={handleSendRequest}
              disabled={sending}
              className="mt-4 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}