import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Symptoms", path: "/symptoms" },
  { name: "Suggestions", path: "/suggestions" },
  { name: "Appointments", path: "/appointments" },
  { name: "Browse Doctors", path: "/doctors" },
  { name: "Profile", path: "/profile" }
];

export default function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen min-w-screen flex bg-[#0b1e34] text-white">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-60 px-6 py-8 border-r border-blue-800 bg-[#102840]">
        <h2 className="text-2xl font-bold text-blue-300 mb-10">HealthMate</h2>
        <nav className="space-y-4">
  {navLinks.map(link => (
    <Link
      key={link.name}
      to={link.path}
      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === link.path
          ? "bg-blue-300 text-white font-semibold"
          : "text-sky-200 hover:bg-blue-600 hover:text-white"
      }`}
    >
      {link.name}
    </Link>
  ))}
</nav>

      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#102840] shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-300">HealthMate</h2>
              <button onClick={closeMobile}><X className="text-white" /></button>
            </div>
            <nav className="space-y-4">
  {navLinks.map(link => (
    <Link
      key={link.name}
      to={link.path}
      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === link.path
          ? "bg-blue-500 text-white font-semibold"
          : "text-sky-200 hover:bg-blue-600 hover:text-white"
      }`}
    >
      {link.name}
    </Link>
  ))}
</nav>

          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeMobile}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-[#0b1e34]">
        {/* Topbar for Mobile */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleMobile}
            className="text-blue-300 text-xl font-semibold flex items-center gap-2"
          >
            <Menu /> Menu
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
