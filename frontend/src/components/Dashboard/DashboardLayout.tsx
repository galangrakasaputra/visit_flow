import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";

import Sidebar from "../Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={handleOpenSidebar}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
            aria-label="Buka sidebar"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-bold text-blue-600">
            Visit Flow
          </h1>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;