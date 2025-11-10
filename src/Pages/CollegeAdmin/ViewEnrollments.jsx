import { useState, useEffect } from "react";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import coursesData from "../../data/courses.json";
import enrollmentsData from "../../data/enrollments.json";
import studentsData from "../../data/students.json";
import usersData from "../../data/users.json";
import departmentsData from "../../data/departments.json";

export default function EnrollmentsPage() {
  // Current logged-in admin (Ravi Kumar from Tech Valley Institute)
  const currentUser = {
    user_id: 2,
    college_id: 1,
    email: "ravi.kumar@techvalley.edu",
  };

  const [enrollmentInfo, setEnrollmentInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = () => {
    // 1. Get all students from current admin's college
    const collegeStudents = studentsData.filter(s => s.college_id === currentUser.college_id);

    // 2. Get all courses from current admin's college
    const collegeCourses = coursesData.filter(c => c.college_id === currentUser.college_id);
    const courseMap = Object.fromEntries(collegeCourses.map(c => [c.course_id, c]));

    // 3. Map each student to their enrolled courses
    const studentEnrollments = collegeStudents.map(student => {
      // Get user info for student name
      const user = usersData.find(u => u.user_id === student.user_id);
      
      // All enrollments for this student
      const studentEnrollmentsData = enrollmentsData.filter(e => e.student_id === student.student_id);

      // Map enrollments with full course and department info
      const enrolledCourses = studentEnrollmentsData.map(enrollment => {
        const course = courseMap[enrollment.course_id];
        const dept = departmentsData.find(d => d.dept_id === course.dept_id);
        
        return {
          enrollment_id: enrollment.enrollment_id,
          course_name: course.course_name,
          department: dept ? dept.dept_name : "Unknown",
          dept_id: course.dept_id,
          requested_at: enrollment.requested_at,
          credits: course.credits,
        };
      });

      // Group by department
      const coursesByDept = enrolledCourses.reduce((acc, enrollment) => {
        if (!acc[enrollment.department]) {
          acc[enrollment.department] = [];
        }
        acc[enrollment.department].push(enrollment);
        return acc;
      }, {});

      return {
        student_id: student.student_id,
        studentName: user ? user.full_name : "Unknown Student",
        studentEmail: user ? user.email : "",
        department: departmentsData.find(d => d.dept_id === student.dept_id)?.dept_name || "N/A",
        coursesByDept,
        totalEnrollments: enrolledCourses.length,
      };
    });

    setEnrollmentInfo(studentEnrollments);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter enrollments based on search only
  const filteredEnrollments = enrollmentInfo.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalEnrollments = enrollmentInfo.reduce((acc, s) => acc + s.totalEnrollments, 0);

  return (
    <CollegeAdminLayout activePage="enrollments">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Enrollments</h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all student course enrollments
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
              <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{enrollmentInfo.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm font-medium">Total Enrollments</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalEnrollments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm font-medium">Avg. Enrollments/Student</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {enrollmentInfo.length > 0 ? (totalEnrollments / enrollmentInfo.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by student name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Student Enrollments List */}
        <div className="space-y-4">
          {filteredEnrollments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No enrollments found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredEnrollments.map((student) => (
              <div key={student.student_id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Student Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {student.studentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{student.studentName}</h3>
                        <p className="text-sm text-gray-600">{student.studentEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Department: <span className="font-semibold text-gray-800">{student.department}</span></p>
                      <p className="text-xs text-gray-500 mt-1">Student ID: {student.student_id}</p>
                    </div>
                  </div>
                </div>

                {/* Enrollment Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Course Enrollments</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-semibold text-indigo-600 text-lg">{student.totalEnrollments}</span> Courses
                      </span>
                    </div>
                  </div>

                  {Object.keys(student.coursesByDept).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-gray-500 text-sm">No courses enrolled yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(student.coursesByDept).map(([dept, courses]) => (
                        <div key={dept} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h5 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {dept}
                          </h5>
                          <div className="space-y-2">
                            {courses.map((enrollment, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{enrollment.course_name}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {enrollment.credits} Credits • Enrolled: {formatDate(enrollment.requested_at)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CollegeAdminLayout>
  );
}