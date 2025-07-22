import DashboardOverview from "./DashboardOverview";
import { useAuthStore } from "../../contexts/AuthStore";
import DashboardLayout from "../../layouts/DashboardLayout";

const Home = () => {
  const { authUser, authRole, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth)
    return <div className="text-center mt-10 text-gray-300">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <div className="bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-400">
              Welcome to your Dashboard
            </h1>
            <p className="mt-3 text-gray-300 text-sm sm:text-base">
              Select a section from the sidebar to get started.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl shadow p-6">
            <DashboardOverview />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Home;
