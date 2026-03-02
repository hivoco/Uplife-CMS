import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, HelpCircle, Instagram } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: MessageSquare },
  { to: '/blogs', label: 'Blogs', icon: FileText },
  { to: '/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/insta-posts', label: 'Insta Posts', icon: Instagram },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#457e7f] h-screen text-white flex flex-col sticky top-0">
      <div className="p-6 text-xl font-bold border-b border-white/20">
        Uplife CMS
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
