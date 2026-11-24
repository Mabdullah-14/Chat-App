import { useState, useEffect } from "react";
import { MessagesSquare } from "lucide-react";
import MainLayout from "../components/layout/mainLayout";
import ChatComponent from "../components/chatComponents";
import { useAuth } from "../Context/authContext";
import { useSocket } from "../Context/socketContext";
import { useContacts } from "../src/hooks/queries/userContacts";

export default function Home() {
  const { user: loggedInUser, logout } = useAuth();
  const socket = useSocket();

  const [activeId, setActiveId] = useState(null);
  const [chatMeta, setChatMeta] = useState({});

  const {
    data: contacts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useContacts();
console.log("contacts data:", contacts);
  const chats = contacts.map((contact) => ({
    ...contact,
    lastMessage:
      chatMeta[contact.id]?.lastMessage ?? "Click to start conversation",
    unread: chatMeta[contact.id]?.unread ?? 0,
    time: "",
    online: false,
  }));

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      if (!msg?.senderId) return;

      const senderId = String(msg.senderId);
      const isActive = senderId === String(activeId);

      setChatMeta((prev) => ({
        ...prev,
        [senderId]: {
          unread: isActive ? 0 : (prev[senderId]?.unread || 0) + 1,
          lastMessage: msg.text || "Sent you a file",
        },
      }));
    };

    socket.on("receive_message", handleIncomingMessage);
    return () => socket.off("receive_message", handleIncomingMessage);
  }, [socket, activeId]);

  const handleSelectChat = (id) => {
    const contactId = String(id);
    setActiveId(contactId);
    setChatMeta((prev) => ({
      ...prev,
      [contactId]: { ...prev[contactId], unread: 0 },
    }));
  };

  const activeChat = chats.find((chat) => String(chat.id) === activeId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-400">
        Loading contacts...
      </div>
    );
  }

  return (
    <MainLayout
      user={loggedInUser}
      chats={chats}
      activeId={activeId}
      onSelectChat={handleSelectChat}
      onLogout={logout}
    >
      {isError ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-red-600">{error?.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      ) : activeChat ? (
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex h-14 w-full items-center border-b border-slate-200 bg-white px-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              <h1 className="text-base font-semibold text-slate-900">
                {activeChat.name}
              </h1>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <ChatComponent receiverId={activeChat.id} key={activeChat.id} />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <MessagesSquare className="h-8 w-8" />
          </div>

          <h1 className="text-xl font-semibold text-slate-900">Select a chat</h1>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Select an accepted contact from the sidebar to start chatting.
          </p>
        </div>
      )}
    </MainLayout>
  );
}