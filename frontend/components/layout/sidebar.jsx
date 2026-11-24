import { useState } from "react";
import { X, UserPlus, UserRound } from "lucide-react";

import Avatar from "../../components/ui/Avator";
import SearchUser from "../ui/searchUser";
import IncomingRequests from "../ui/IncomingRequest";
import { useContacts } from "../../src/hooks/queries/userContacts";

export default function Sidebar({
  chats = [],
  activeId,
  onSelect,
  onSelectChat,
  open,
  onClose,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const {
    data: contacts = [],
    isLoading: contactsLoading,
    error: contactsErrorObj,
    refetch: fetchContacts,
  } = useContacts();

  const contactsError = contactsErrorObj
    ? contactsErrorObj.message || "Failed to load contacts."
    : "";

  const selectContact = onSelectChat ?? onSelect;

  // return (...) neeche sab pehle jaisa

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85%] flex-col border-r border-slate-200 bg-white transition-transform md:static md:z-auto md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Chats</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chats"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <UserPlus size={18} />
            Add Connection
          </button> 
        </div>

        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setShowRequests(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
          >
            <UserRound size={18} />
            Connection Requests
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          <li className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">
                MY CONTACTS
              </h3>
            </div>

            {contactsLoading ? (
              <p className="text-sm text-slate-500">Loading contacts...</p>
            ) : contactsError ? (
              <div>
                <p className="text-sm text-red-500">{contactsError}</p>
                <button
                  type="button"
                  onClick={() => fetchContacts()}
                  className="mt-2 text-sm font-medium text-teal-700 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-slate-500">No accepted contacts yet.</p>
            ) : (
              <div className="space-y-1">
                {contacts.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      selectContact?.(user.id);
                      onClose?.();
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-teal-50 ${
                      String(activeId) === String(user.id) ? "bg-teal-50" : ""
                    }`}
                  >
                    <Avatar name={user.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </li>

          <li className="border-t border-slate-100 px-4 py-3">
            <h3 className="mb-3 text-sm font-semibold text-slate-500">CHATS</h3>
          </li>

          {chats.length === 0 && (
            <li className="px-4 pb-8 text-center text-sm text-slate-500">
              There are no chats right now. Search for someone to get started.
            </li>
          )}

          {chats.map((chat) => {
            const unreadCount = Number(chat.unread) || 0;
            const isChatActive = String(activeId) === String(chat.id);

            return (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectContact?.(chat.id);
                    onClose?.();
                  }}
                  className={`flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    isChatActive
                      ? "border-teal-600 bg-teal-50"
                      : "border-transparent"
                  }`}
                >
                  <Avatar name={chat.name} online={chat.online} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {chat.name}
                      </p>
                      <span className="shrink-0 text-xs text-slate-400">
                        {chat.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm ${
                          unreadCount > 0
                            ? "font-semibold text-slate-900"
                            : "text-slate-500"
                        }`}
                      >
                        {chat.lastMessage}
                      </p>

                      {unreadCount > 0 && !isChatActive && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-bold text-white shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {showSearch && <SearchUser onClose={() => setShowSearch(false)} />}

      {showRequests && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="mx-auto flex max-w-2xl justify-end p-4">
            <button
              type="button"
              onClick={() => setShowRequests(false)}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <IncomingRequests />
        </div>
      )}
    </>
  );
}