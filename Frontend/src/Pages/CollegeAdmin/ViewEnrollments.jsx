import { useState, useEffect } from "react";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import { fetchDashboard } from "../../services/collegeAdminService";

export default function EnrollmentsPage() {
  const [enrollmentInfo, setEnrollmentInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDept, setExpandedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data which should include enrollment information
      const dashboardData = await fetchDashboard();

      // Process enrollment data - API returns recentEnrollments array
      if (
        dashboardData?.recentEnrollments &&
        Array.isArray(dashboardData.recentEnrollments)
      ) {
        // Group the enrollments by department (we'll need to add department info or group by course)
        // For now, we'll use course name as a grouping since department isn't in recentEnrollments
        const grouped = groupEnrollmentsByCourse(
          dashboardData.recentEnrollments
        );
        setEnrollmentInfo(grouped);
      } else if (dashboardData?.enrollmentsByDepartment) {
        setEnrollmentInfo(dashboardData.enrollmentsByDepartment);
      } else if (dashboardData?.allEnrollments) {
        const grouped = groupEnrollmentsByDepartment(
          dashboardData.allEnrollments
        );
        setEnrollmentInfo(grouped);
      } else {
        setEnrollmentInfo([]);
      }
    } catch (err) {
      console.error("Error loading enrollments:", err);
      setError("Failed to load enrollment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const groupEnrollmentsByCourse = (enrollments) => {
    const grouped = {};

    enrollments.forEach((enrollment) => {
      const course = enrollment.courseName || "Uncategorized";
      if (!grouped[course]) {
        grouped[course] = [];
      }
      grouped[course].push({
        studentId: enrollment.studentId,
        studentName: enrollment.studentName,
        studentEmail: enrollment.studentEmail,
        courseName: enrollment.courseName,
        credits: enrollment.credits,
        enrolledAt: enrollment.enrollmentDate, // API uses enrollmentDate not enrolledAt
      });
    });

    return Object.entries(grouped).map(([course, students]) => ({
      department: course, // Using course name as department for display
      students: students,
    }));
  };

  const groupEnrollmentsByDepartment = (enrollments) => {
    const grouped = {};

    enrollments.forEach((enrollment) => {
      const dept = enrollment.departmentName || "Uncategorized";
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push({
        studentId: enrollment.studentId,
        studentName: enrollment.studentName,
        studentEmail: enrollment.studentEmail,
        courseName: enrollment.courseName,
        credits: enrollment.credits,
        enrolledAt: enrollment.enrolledAt,
      });
    });

    return Object.entries(grouped).map(([dept, students]) => ({
      department: dept,
      students: students,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter enrollments by search term
  const filteredEnrollments = enrollmentInfo.filter((deptData) => {
    const term = searchTerm.toLowerCase();
    return (
      deptData.department.toLowerCase().includes(term) ||
      deptData.students?.some(
        (s) =>
          s.studentName?.toLowerCase().includes(term) ||
          s.studentEmail?.toLowerCase().includes(term)
      )
    );
  });

  // Create a map for easy access
  const studentsByDept = filteredEnrollments.reduce((acc, deptData) => {
    acc[deptData.department] = deptData.students || [];
    return acc;
  }, {});

  if (loading) {
    return (
      <CollegeAdminLayout activePage="enrollments">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enrollments...</p>
          </div>
        </div>
      </CollegeAdminLayout>
    );
  }

  if (error) {
    return (
      <CollegeAdminLayout activePage="enrollments">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-800 font-semibold mb-2">{error}</p>
            <button
              onClick={loadEnrollments}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </CollegeAdminLayout>
    );
  }

  return (
    <CollegeAdminLayout activePage="enrollments">
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Enrollments</h2>
        <p className="text-sm text-gray-500 mt-1">
          Expand a course to view enrolled students
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by student name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Accordion-style department list */}
        <div className="space-y-4">
          {Object.entries(studentsByDept).map(([dept, students]) => (
            <div
              key={dept}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              {/* Department Header */}
              <button
                onClick={() =>
                  setExpandedDept(expandedDept === dept ? null : dept)
                }
                className="w-full flex items-center justify-between bg-indigo-50 px-6 py-4 hover:bg-indigo-100 transition-all"
              >
                <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {dept}
                </h3>
                <span className="text-sm text-gray-600">
                  {students.length} students
                </span>
              </button>

              {/* Expanded students list */}
              {expandedDept === dept && (
                <div className="p-6 space-y-4 border-t border-gray-200">
                  {students.map((student, idx) => (
                    <div
                      key={student.studentId || idx}
                      className="border border-gray-200 rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {student.studentName || "Unknown Student"}
                          </h4>
                        </div>
                        {student.studentId && (
                          <span className="text-xs text-gray-500">
                            ID: {student.studentId}
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-800">
                          {student.courseName || "Unknown Course"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {student.credits
                              ? `${student.credits} Credits`
                              : ""}
                          </p>
                          {student.enrolledAt && (
                            <p className="text-xs text-gray-500">
                              {formatDate(student.enrolledAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {Object.keys(studentsByDept).length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg font-medium">
                No enrollments found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search
              </p>
            </div>
          )}
        </div>
      </div>
    </CollegeAdminLayout>
  );
}
