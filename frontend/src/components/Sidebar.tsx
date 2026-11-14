import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  LogOut,
  X,
} from "lucide-react";

import { logoutUser } from "../api/AuthApi";
import { removeToken } from "../utils/AuthStorage";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Entitas",
    path: "/entitas",
    icon: Building2,
  },
  {
    title: "Kunjungan",
    path: "/kunjungan",
    icon: CalendarDays,
  },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Gagal menghubungi API logout:", error);
    } finally {
      removeToken();
      navigate("/login", { replace: true });
      onClose();
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex min-h-screen w-64 shrink-0 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-30 lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 px-6">
          <h1 className="text-xl font-bold text-blue-600">
            Visit Flow
          </h1>

          {/* Tombol Close Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu Utama
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

          {/* Logout */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;