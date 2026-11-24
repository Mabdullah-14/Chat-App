import { Menu, MessageCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from '../../components/ui/Avator'
import Button from '../../components/ui/Button'
import { useAuth } from "../../Context/authContext";

export default function Navbar({ user, onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open chats"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900">ChatApp</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <Avatar name={user?.name} src={user?.avatar} online />
        <Button variant="ghost" onClick={handleLogoutClick} aria-label="Log out" >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
