import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Modal from "../../components/Modal";
import dataService from "../../services/dataService";

const BrowseCourses = () => {
  // Mock current user
  const currentUser = { id: "S001", studentId: "S001" };

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterDepartment, courses]);

  const loadCourses = () => {
    const allCourses = dataService.getAll("courses");
    setCourses(allCourses);
  };

  const filterCourses = () => {
    let filtered = courses;

    if (filterDepartment !== "All") {
      filtered = filtered.filter((c) => c.department === filterDepartment);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const departments = ["All", ...new Set(courses.map((c) => c.department))];

  const handleEnrollRequest = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = () => {
    const newEnrollment = {
      id: `E${Date.now()}`,
      studentId: currentUser.id,
      courseId: selectedCourse.id,
      status: "Pending",
      requestDate: new Date().toISOString().split("T")[0],
      approvedDate: null,
      approvedBy: null,
      semester: selectedCourse.semester,
      grade: null,
    };

    dataService.create("enrollments", newEnrollment);
    setShowEnrollModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Layout>
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
            Enrollment request submitted successfully! Waiting for admin
            approval.
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
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
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
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
                <h3 className="text-lg font-bold">{course.code}</h3>
                <p className="text-blue-100 text-sm">{course.department}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {course.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {course.instructor}
                  </div>
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.schedule}
                  </div>
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {course.room}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    {course.credits} Credits
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      course.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.enrolled}/{course.capacity} Enrolled
                  </span>
                </div>

                <button
                  onClick={() => handleEnrollRequest(course)}
                  disabled={course.status === "Full"}
                  className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                    course.status === "Full"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {course.status === "Full"
                    ? "Course Full"
                    : "Request Enrollment"}
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
        onClose={() => setShowEnrollModal(false)}
        title="Confirm Enrollment Request"
      >
        {selectedCourse && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedCourse.name}
              </h3>
              <p className="text-gray-600">{selectedCourse.code}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Course Details:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Instructor:</strong> {selectedCourse.instructor}
                </li>
                <li>
                  <strong>Schedule:</strong> {selectedCourse.schedule}
                </li>
                <li>
                  <strong>Credits:</strong> {selectedCourse.credits}
                </li>
                <li>
                  <strong>Room:</strong> {selectedCourse.room}
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Your enrollment request will be sent to the admin for approval.
              You will be notified once it has been reviewed.
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
              >
                Confirm Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BrowseCourses;
