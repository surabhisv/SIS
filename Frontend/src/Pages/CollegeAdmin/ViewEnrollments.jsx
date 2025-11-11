import { useState, useEffect } from "react";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import coursesData from "../../data/courses.json";
import enrollmentsData from "../../data/enrollments.json";
import studentsData from "../../data/students.json";
import usersData from "../../data/users.json";
import departmentsData from "../../data/departments.json";

export default function EnrollmentsPage() {
  const currentUser = {
    user_id: 2,
    college_id: 1,
    email: "ravi.kumar@techvalley.edu",
  };

  const [enrollmentInfo, setEnrollmentInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDept, setExpandedDept] = useState(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = () => {
    const collegeStudents = studentsData.filter(s => s.college_id === currentUser.college_id);
    const collegeCourses = coursesData.filter(c => c.college_id === currentUser.college_id);
    const courseMap = Object.fromEntries(collegeCourses.map(c => [c.course_id, c]));

    const studentEnrollments = collegeStudents.map(student => {
      const user = usersData.find(u => u.user_id === student.user_id);
      const studentEnrollmentsData = enrollmentsData.filter(e => e.student_id === student.student_id);

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

      return {
        student_id: student.student_id,
        studentName: user ? user.full_name : "Unknown Student",
        studentEmail: user ? user.email : "",
        department: departmentsData.find(d => d.dept_id === student.dept_id)?.dept_name || "N/A",
        dept_id: student.dept_id,
        enrolledCourses,
      };
    });

    setEnrollmentInfo(studentEnrollments);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Filter by search
  const filteredStudents = enrollmentInfo.filter(student => {
    const term = searchTerm.toLowerCase();
    return (
      student.studentName.toLowerCase().includes(term) ||
      student.studentEmail.toLowerCase().includes(term) ||
      student.department.toLowerCase().includes(term)
    );
  });

  // Group by department
  const studentsByDept = filteredStudents.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = [];
    acc[s.department].push(s);
    return acc;
  }, {});

  return (
    <CollegeAdminLayout activePage="enrollments">
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Enrollments by Department</h2>
        <p className="text-sm text-gray-500 mt-1">
          Expand a department to view students and their enrolled courses
        </p>
      </div>

      <div className="p-8">
        {/* Search bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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

        {/* Accordion-style department list */}
        <div className="space-y-4">
          {Object.entries(studentsByDept).map(([dept, students]) => (
            <div key={dept} className="bg-white shadow-md rounded-xl overflow-hidden">
              {/* Department Header */}
              <button
                onClick={() => setExpandedDept(expandedDept === dept ? null : dept)}
                className="w-full flex items-center justify-between bg-indigo-50 px-6 py-4 hover:bg-indigo-100 transition-all"
              >
                <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {dept}
                </h3>
                <span className="text-sm text-gray-600">{students.length} students</span>
              </button>

              {/* Expanded students list */}
              {expandedDept === dept && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  {students.map((student) => (
                    <div
                      key={student.student_id}
                      className="border border-gray-200 rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{student.studentName}</h4>
                          <p className="text-sm text-gray-500">{student.studentEmail}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          ID: {student.student_id}
                        </span>
                      </div>

                      {student.enrolledCourses.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No courses enrolled.</p>
                      ) : (
                        <div className="space-y-2">
                          {student.enrolledCourses.map((course, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {course.course_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {course.credits} Credits • {formatDate(course.requested_at)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {Object.keys(studentsByDept).length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg font-medium">No enrollments found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </CollegeAdminLayout>
  );
}
