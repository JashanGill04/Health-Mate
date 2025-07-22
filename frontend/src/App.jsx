import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Home from "./pages/UserDashboard/Home.jsx";
import Symptoms from "./pages/UserDashboard/Symptoms.jsx";
import Suggestions from "./pages/UserDashboard/Suggestions.jsx";
import Appointments from "./pages/UserDashboard/Appointments.jsx";
import Profile from "./pages/UserDashboard/Profile.jsx";
import DoctorDashboard from "./pages/DoctorDashboards/DoctorsDashboard.jsx";
import DoctorsAppointments from "./pages/DoctorDashboards/DoctorsAppointments.jsx";
import DoctorProfile from "./pages/DoctorDashboards/DoctorProfile.jsx";
import { useAuthStore } from "./contexts/AuthStore.jsx";
import AdminArticles from "./pages/admin/AdminArticles";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import BrowseDoctors from "./pages/UserDashboard/BrowseDoctors.jsx";
import DoctorProfileForPatient from "./pages/UserDashboard/DoctorProfileForPatient.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth, authRole } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  if (isCheckingAuth) return <div>Loading app...</div>;

  return (
    <div>
      <Routes>
       <Route
  path="/"
  element={
    !authUser ? (
      <Login />
    ) : authUser.role === "doctor" ? (
      <Navigate to="/doctor/dashboard" />
    ) : authUser.role === "admin" ? (
      <Navigate to="/admin/articles" />
    ) : (
      <Navigate to="/home" />
    )
  }
/>


        <Route
          path="/register"
          element={
            !authUser ? (
              <Register />
            ) : authUser.role === "doctor" ? (
              <Navigate to="/doctor/dashboard" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute role="patient">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute role="patient">
              <BrowseDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors/:id"
          element={
            <ProtectedRoute role="patient">
              <DoctorProfileForPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/symptoms"
          element={
            <ProtectedRoute role="patient">
              <Symptoms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedRoute role="patient">
              <Suggestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute role="patient">
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="patient">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="doctor">
              <DoctorsAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute role="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
  <Route
    path="/admin/articles"
    element={
      <ProtectedRoute role="admin">
        <AdminArticles />
      </ProtectedRoute>
    }
  />




      </Routes>
    </div>
  );
}

export default App;
