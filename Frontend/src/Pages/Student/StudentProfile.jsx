import { useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";

const StudentProfile = () => {
  // Mock current user - based on actual database schema
  const [currentUser, setCurrentUser] = useState({
    student_id: "STU001",
    fullName: "Final Test Student",
    email: "final.test.student@gmail.com",
    phone: "5555555555",
    address: "1 Final Test Rd",
    college_id: 1,
    collegeName: "Engineering College", // Will be fetched from colleges table
    dept_id: 1,
    deptName: "Computer Science", // Will be fetched from department table
    approval_status: "APPROVED",
    created_at: "2024-01-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone,
    address: currentUser.address,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditClick = () => {
    // Reset form data to current user values when opening modal
    setFormData({
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      address: currentUser.address,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Make API call to update student profile
    // Allow student to edit basic contact information
    setCurrentUser((prev) => ({
      ...prev,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
    }));
    console.log("Updated data:", formData);
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
            onClick={handleEditClick}
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
                  {currentUser.fullName}
                </h2>
                <p className="text-gray-600">{currentUser.deptName}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      currentUser.approval_status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : currentUser.approval_status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentUser.approval_status}
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
                      {currentUser.student_id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.fullName}
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
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.address}
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
                    <label className="text-sm text-gray-500">College</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.collegeName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Department</label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.deptName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Registration Date
                    </label>
                    <p className="text-gray-800 font-medium">
                      {new Date(currentUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Approval Status
                    </label>
                    <p className="text-gray-800 font-medium">
                      {currentUser.approval_status}
                    </p>
                  </div>
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
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can update your name, phone number,
                and address here. Other changes must go through your college
                administrator.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
