import { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";
export default function MainLayout({ user, chats, activeId, onSelectChat, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} onLogout={onLogout} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          chats={chats}
          activeId={activeId}
          onSelect={onSelectChat}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}