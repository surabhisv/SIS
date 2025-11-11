import { useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import studentsData from "../../data/students.json";

const StudentProfile = () => {
  // Mock current user - hardcoded student data
  const currentUser = studentsData[0]; // Using first student from JSON

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...currentUser,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Just show success message - no actual update without backend
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your personal information
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end -mt-16 mb-6">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <div className="bg-blue-100 text-blue-600 rounded-full p-6">
                  <svg
                    className="w-20 h-20"
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
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-gray-600">{currentUser.major}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {currentUser.year}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {currentUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Student ID</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Date of Birth
                    </label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.gender}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Academic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">
                      Enrollment Date
                    </label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.enrollmentDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Major</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.major}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Year</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.year}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">GPA</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.gpa}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-500">
                    Street Address
                  </label>
                  <p className="text-gray-800 font-medium">
                    {currentUser.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">City</label>
                  <p className="text-gray-800 font-medium">
                    {currentUser.city}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">State</label>
                  <p className="text-gray-800 font-medium">
                    {currentUser.state}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Zip Code</label>
                  <p className="text-gray-800 font-medium">
                    {currentUser.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default StudentProfile;
