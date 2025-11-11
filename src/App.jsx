import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page components
import Home from "./Pages/Home.jsx";

import SuperAdmin from "./Pages/SuperAdmin/SuperAdmin.jsx";
import SuperAdminPortal from "./Pages/SuperAdmin/SuperAdminPortal.jsx";


import StudentRegister from "./Pages/Student/StudentRegister.jsx";
import StudentLogin from "./Pages/Student/StudentLogin.jsx";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import BrowseCourses from "./pages/student/BrowseCourses";
import StudentEnrollments from "./pages/student/StudentEnrollments";

//College Admin imports
import CollegeAdminLogin from "./Pages/CollegeAdmin/CollegeAdminLogin.jsx";
import CollegeAdminDashboard from "./Pages/CollegeAdmin/CollegeAdminDashboard.jsx";
import CollegeAdminRequest from "./Pages/CollegeAdmin/CollegeAdminRequest.jsx";
import ManageCourses from "./Pages/CollegeAdmin/ManageCourses.jsx";
import AddCourse from "./Pages/CollegeAdmin/AddCourse.jsx";
import ViewEnrollments from "./Pages/CollegeAdmin/ViewEnrollments.jsx";
import SeatManagementPage from "./Pages/CollegeAdmin/SeatManagement.jsx";



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

        {/* College Admin pages */}
        <Route path="/Collegeadmin/CollegeAdminlogin" element={<CollegeAdminLogin />} />
        <Route path="/CollegeAdmin/CollegeAdminDashboard" element={<CollegeAdminDashboard/>} />
        <Route path="/CollegeAdmin/CollegeAdminRequest" element={<CollegeAdminRequest/>} />
        <Route path="/CollegeAdmin/ManageCourses" element={<ManageCourses/>} />
        <Route path="/CollegeAdmin/AddCourse" element={<AddCourse/>} />
        <Route path="/CollegeAdmin/ViewEnrollments" element={<ViewEnrollments/>} />
        <Route path="/CollegeAdmin/SeatManagement" element={<SeatManagementPage/>} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
