import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import { fetchCourses, deleteCourse } from "../../services/collegeAdminService";
import { fetchDepartments } from "../../services/publicService";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCoursesAndDepartments();
  }, []);

  const loadCoursesAndDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses and departments in parallel
      const [coursesData, depts] = await Promise.all([
        fetchCourses(),
        fetchDepartments(),
      ]);

      setCourses(coursesData || []);
      setDepartments(Array.isArray(depts) ? depts : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load courses. Please try again.");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = useCallback(() => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
if (selectedDepartment !== "all") {
  const dept = departments.find(
    (d) => d.deptId === Number(selectedDepartment)
  );

  if (dept) {
    filtered = filtered.filter(
      (c) => c.departmentName === dept.deptName
    );
  }
}


    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedDepartment]);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);
      await deleteCourse(courseToDelete.courseId);
      setCourses(courses.filter((c) => c.courseId !== courseToDelete.courseId));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (course) => {
    const now = new Date();
    const startDate = course.startDate ? new Date(course.startDate) : null;
    const endDate = course.endDate ? new Date(course.endDate) : null;

    if (startDate && endDate) {
      if (now < startDate) return "bg-blue-100 text-blue-800";
      if (now > endDate) return "bg-gray-100 text-gray-800";
    }
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (course) => {
    const now = new Date();
    const startDate = course.startDate ? new Date(course.startDate) : null;
    const endDate = course.endDate ? new Date(course.endDate) : null;

    if (startDate && endDate) {
      if (now < startDate) return "Upcoming";
      if (now > endDate) return "Completed";
    }
    return "Open";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <CollegeAdminLayout activePage="courses">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </CollegeAdminLayout>
    );
  }

  if (error) {
    return (
      <CollegeAdminLayout activePage="courses">
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
              onClick={loadCoursesAndDepartments}
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
    <CollegeAdminLayout activePage="courses">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Courses</h2>
        </div>
        <Link
          to="/CollegeAdmin/AddCourse"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Course</span>
        </Link>
      </div>

      <div className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
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
                placeholder="Search courses by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              {Array.isArray(departments) &&
                departments.map((dept) => (
                  <option key={dept.deptId} value={dept.deptId}>
                    {dept.deptName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredCourses.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Enrollments</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredCourses.reduce(
                (acc, c) => acc + (c.enrolledCount || 0),
                0
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Departments</p>
            <p className="text-2xl font-bold text-gray-800">
              {departments.length}
            </p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => {
                    return (
                      <tr
                        key={course.courseId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {course.courseName}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {course.description || "No description"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {course.departmentName || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.credits} Credits
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-gray-600">
                            <span>{formatDate(course.startDate)}</span>
                            <span className="text-gray-400">to</span>
                            <span>{formatDate(course.endDate)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              course
                            )}`}
                          >
                            {getStatusText(course)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(course)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No courses found
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Link
                to="/CollegeAdmin/AddCourse"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Your First Course
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-bold text-gray-900">
                Delete Course
              </h3>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {courseToDelete?.courseName}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All enrollments and related data
              will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CollegeAdminLayout>
  );
}
