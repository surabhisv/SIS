import { useState, useEffect } from "react";
import CollegeAdminLayout from "../../components/CollegeAdminLayout";
import coursesData from "../../data/courses.json";

export default function AddCourse() {
  const currentUser = {
    id: "admin1",
    collegeId: "C001",
    email: "admin@demo.com",
  };

  const [existingDepartments, setExistingDepartments] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    department: "",
    credits: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const allCourses = [...coursesData, ...localCourses].filter(
      c => c.collegeId === currentUser.collegeId
    );
    const depts = [...new Set(allCourses.map(c => c.department).filter(Boolean))];
    setExistingDepartments(depts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.credits || formData.credits <= 0) newErrors.credits = "Credits must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newCourse = {
        id: formData.code,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        department: formData.department,
        credits: parseInt(formData.credits),
        collegeId: currentUser.collegeId,
        status: "Open"
      };

      const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      localStorage.setItem("courses", JSON.stringify([...existingCourses, newCourse]));

      setExistingDepartments(prev => {
        if (!prev.includes(newCourse.department)) return [...prev, newCourse.department];
        return prev;
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      department: "",
      credits: "",
    });
    setErrors({});
  };

  return (
    <CollegeAdminLayout activePage="courses">
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Course</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new course offering for your college</p>
          </div>
          <a href="/CollegeAdmin/ManageCourses" className="text-gray-600 hover:text-gray-800 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Courses</span>
          </a>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., CS101"
                    className={`w-full px-4 py-2 border rounded-lg ${errors.code ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Programming"
                    className={`w-full px-4 py-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    list="departments"
                    placeholder="e.g., Computer Science"
                    className={`w-full px-4 py-2 border rounded-lg ${errors.department ? "border-red-500" : "border-gray-300"}`}
                  />
                  <datalist id="departments">
                    {existingDepartments.map(dept => <option key={dept} value={dept} />)}
                  </datalist>
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    max="6"
                    className={`w-full px-4 py-2 border rounded-lg ${errors.credits ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional course description"
                    className="w-full px-4 py-2 border rounded-lg"
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Course Created Successfully!</h3>
            <p className="text-gray-600 mb-6">{formData.name} has been added to your course offerings.</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => { setShowSuccessModal(false); handleReset(); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Add Another
              </button>
              <button
                onClick={() => window.location.href = "/CollegeAdmin/ManageCourses"}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </CollegeAdminLayout>
  );
}
