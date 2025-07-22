// src/layouts/DoctorLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { Calendar, Users, UserCircle } from "lucide-react";

const DoctorLayout = ({children}) => {
  return (
    <div className="flex w-screen min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] p-6 space-y-6 border-r border-gray-700 hidden md:block">
        <div className="text-2xl font-bold text-blue-400">Doctor Panel</div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/doctor/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-blue-300 font-semibold"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            <Calendar size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/doctor/appointments"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-blue-300 font-semibold"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            <Users size={18} /> Appointments
          </NavLink>
          <NavLink
            to="/doctor/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-blue-300 font-semibold"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            <UserCircle size={18} /> Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#0f172a] text-white overflow-auto">
       {children}
      </main>
    </div>
  );
};

export default DoctorLayout;
