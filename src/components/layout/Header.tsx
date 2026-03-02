import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
