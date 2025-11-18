import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Modal from "../../components/Modal";
import {
  fetchAvailableCourses,
  enrollInCourse,
} from "../../services/studentService";

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCoursesAndDepartments();
  }, []);

  const loadCoursesAndDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await fetchAvailableCourses();
      // API returns array directly, not an object with courses property
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = courses;

    if (filterDepartment !== "All") {
      filtered = filtered.filter((c) => c.departmentName === filterDepartment);
    }

    if (searchTerm) {
      const lowered = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          (c.courseName && c.courseName.toLowerCase().includes(lowered)) ||
          (c.description && c.description.toLowerCase().includes(lowered)) ||
          (c.courseId && c.courseId.toString().includes(lowered))
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, filterDepartment, courses]);

  const handleEnrollRequest = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    try {
      setEnrolling(true);
      await enrollInCourse(selectedCourse.courseId);
      setShowEnrollModal(false);
      setSelectedCourse(null);
      setShowSuccess(true);
      loadCoursesAndDepartments(); // Reload courses to update seat availability
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert(
        error.response?.data?.message || "Failed to enroll. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Layout userName="Student">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout userName="Student">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={loadCoursesAndDepartments}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Browse Courses</h1>
          <p className="text-gray-600 mt-1">
            Explore and enroll in available courses
          </p>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Successfully enrolled in the course!
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by course name, code, or instructor..."
              />
            </div>
            <div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Departments</option>
                {[...new Set(courses.map((c) => c.departmentName))]
                  .filter(Boolean)
                  .map((deptName) => (
                    <option key={deptName} value={deptName}>
                      {deptName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
                <h3 className="text-lg font-bold">
                  {course.courseName || "Course Name"}
                </h3>
                <p className="text-blue-100 text-sm">
                  Course ID: {course.courseId}
                </p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description || "No description available"}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {course.startDate && course.endDate
                      ? `${course.startDate} - ${course.endDate}`
                      : "Dates TBD"}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    {course.credits || 0} Credits
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800">
                    Seat Limit: {course.seatLimit || 0}
                  </span>
                </div>

                <button
                  onClick={() => handleEnrollRequest(course)}
                  disabled={
                    course.isFull || course.enrollmentStatus === "ENROLLED"
                  }
                  className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                    course.isFull || course.enrollmentStatus === "ENROLLED"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {course.enrollmentStatus === "ENROLLED"
                    ? "Already Enrolled"
                    : course.isFull
                    ? "Course Full"
                    : "Enroll Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Enrollment Confirmation Modal */}
      <Modal
        isOpen={showEnrollModal}
        onClose={() => !enrolling && setShowEnrollModal(false)}
        title="Confirm Enrollment"
      >
        {selectedCourse && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedCourse.courseName || "Course"}
              </h3>
              <p className="text-gray-600">
                Course ID: {selectedCourse.courseId || "N/A"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Course Details:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Description:</strong>{" "}
                  {selectedCourse.description || "N/A"}
                </li>
                <li>
                  <strong>Duration:</strong>{" "}
                  {selectedCourse.startDate && selectedCourse.endDate
                    ? `${selectedCourse.startDate} - ${selectedCourse.endDate}`
                    : "Dates TBD"}
                </li>
                <li>
                  <strong>Credits:</strong> {selectedCourse.credits || "N/A"}
                </li>
                <li>
                  <strong>Seat Limit:</strong> {selectedCourse.seatLimit || 0}
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              You will be enrolled in this course immediately upon confirmation.
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEnrollModal(false)}
                disabled={enrolling}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                disabled={enrolling}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {enrolling ? "Enrolling..." : "Confirm Enrollment"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BrowseCourses;
