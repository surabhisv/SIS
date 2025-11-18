import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import { addCourse } from "../../services/collegeAdminService";
import { fetchDepartments } from "../../services/publicService";

export default function AddCourse() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    deptId: "",
    credits: "",
    seatLimit: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoadingDepts(true);
      const depts = await fetchDepartments();
      setDepartments(Array.isArray(depts) ? depts : []);
    } catch (error) {
      console.error("Error loading departments:", error);
      setApiError("Failed to load departments. Please refresh the page.");
      setDepartments([]);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName.trim())
      newErrors.courseName = "Course name is required";
    if (!formData.deptId) newErrors.deptId = "Department is required";
    if (!formData.credits || formData.credits <= 0)
      newErrors.credits = "Credits must be greater than 0";
    if (!formData.seatLimit || formData.seatLimit <= 0)
      newErrors.seatLimit = "Seat limit must be greater than 0";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    )
      newErrors.endDate = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      const courseData = {
        courseName: formData.courseName,
        description: formData.description || "",
        credits: parseInt(formData.credits),
        seatLimit: parseInt(formData.seatLimit),
        deptId: parseInt(formData.deptId),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await addCourse(courseData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding course:", error);
      setApiError(
        error.response?.data?.message ||
          "Failed to add course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      courseName: "",
      description: "",
      deptId: "",
      credits: "",
      seatLimit: "",
      startDate: "",
      endDate: "",
    });
    setErrors({});
    setApiError(null);
  };

  return (
    <CollegeAdminLayout activePage="courses">
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Course</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new course offering for your college
            </p>
          </div>
          <Link
            to="/CollegeAdmin/ManageCourses"
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Courses</span>
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {apiError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{apiError}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Programming"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.courseName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.courseName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="deptId"
                    value={formData.deptId}
                    onChange={handleChange}
                    disabled={loadingDepts}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.deptId ? "border-red-500" : "border-gray-300"
                    } ${loadingDepts ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <option value="">
                      {loadingDepts
                        ? "Loading departments..."
                        : "Select Department"}
                    </option>
                    {Array.isArray(departments) &&
                      departments.map((dept) => (
                        <option key={dept.deptId} value={dept.deptId}>
                          {dept.deptName}
                        </option>
                      ))}
                  </select>
                  {errors.deptId && (
                    <p className="text-red-500 text-xs mt-1">{errors.deptId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits *
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    max="6"
                    placeholder="e.g., 3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.credits ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.credits && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.credits}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seat Limit *
                  </label>
                  <input
                    type="number"
                    name="seatLimit"
                    value={formData.seatLimit}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 60"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.seatLimit ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.seatLimit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.seatLimit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of the course content and objectives"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Course Created Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              {formData.courseName} has been added to your course offerings.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  handleReset();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Add Another Course
              </button>
              <button
                onClick={() => navigate("/CollegeAdmin/ManageCourses")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                View All Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </CollegeAdminLayout>
  );
}
