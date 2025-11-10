import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page components
import Home from "./Pages/Home.jsx";

import SuperAdmin from "./Pages/SuperAdmin/SuperAdmin.jsx";
import SuperAdminPortal from "./Pages/SuperAdmin/SuperAdminPortal.jsx";

import StudentRegister from "./Pages/Student/StudentRegister.jsx";
import StudentLogin from "./Pages/Student/StudentLogin.jsx";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import StudentProfile from "./Pages/Student/StudentProfile";
import BrowseCourses from "./Pages/Student/BrowseCourses";
import StudentEnrollments from "./Pages/Student/StudentEnrollments";

import AdminLogin from "./Pages/Admin/AdminLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* App routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Superadmin pages */}
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/superadmin/portal" element={<SuperAdminPortal />} />

        {/* Student pages */}
        <Route path="/student/Studentlogin" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/courses" element={<BrowseCourses />} />
        <Route path="/student/enrollments" element={<StudentEnrollments />} />

        {/* Admin pages */}
        <Route path="/admin/Adminlogin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
