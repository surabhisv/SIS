import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CollegeAdminRequest() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    collegeName: "",
    address: "",
    website: "",
    adminEmail: "",
    password: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.collegeName || !formData.adminEmail || !formData.password) {
      return setError("⚠️ Please fill all required fields.");
    }

    setError("");
    console.log("📩 Request sent:", formData);
    setSuccess("✅ Request sent successfully! You can log in after approval.");

    setTimeout(() => {
      nav("/Collegeadmin/CollegeAdminlogin");
    }, 2500);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center bg-no-repeat text-gray-900"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Left Info Section */}
      <div className="relative z-10 text-white p-10 md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
        <h1 className="text-4xl font-extrabold flex items-center gap-2 drop-shadow-md">
          🎓 Register Your College
        </h1>
        <p className="max-w-md text-gray-200 leading-relaxed text-base md:text-lg drop-shadow-sm">
          If your college isn’t listed yet, submit your registration request here.
          The Super Admin will review your details and activate your college
          account for the SIS portal.
        </p>
        <button
          onClick={() => nav("/Collegeadmin/CollegeAdminlogin")}
          className="mt-2 bg-white/20 border border-white/40 text-white font-medium px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-300"
        >
          ← Back to Login
        </button>
      </div>

      {/* Right Form Section */}
      <div className="relative z-10 md:w-1/2 w-full p-6 md:p-12 flex justify-center">
        <div className="w-full max-w-lg bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
            College Registration Request
          </h2>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="collegeName"
              placeholder="College Name *"
              value={formData.collegeName}
              onChange={handleChange}
              className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <input
              type="text"
              name="website"
              placeholder="Website (optional)"
              value={formData.website}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <input
              type="email"
              name="adminEmail"
              placeholder="Admin Email *"
              value={formData.adminEmail}
              onChange={handleChange}
              className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Desired Password *"
              value={formData.password}
              onChange={handleChange}
              className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />

            <textarea
              name="description"
              placeholder="Brief description (optional)"
              value={formData.description}
              onChange={handleChange}
              className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <button
              type="submit"
              className="col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300"
            >
              Send Request to Super Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
