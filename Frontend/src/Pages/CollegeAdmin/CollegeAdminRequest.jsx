import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCollegeAdmin } from "../../services/collegeAdminService";

export default function CollegeAdminRequest() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    collegeName: "",
    address: "",
    logoUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.collegeName ||
      !formData.address
    ) {
      return setError("⚠️ Please fill all required fields.");
    }

    try {
      setIsSubmitting(true);
      setError("");

      await registerCollegeAdmin(formData);

      setSuccess(
        "✅ Request sent successfully! You can log in after Super Admin approval."
      );

      setTimeout(() => {
        nav("/Collegeadmin/CollegeAdminlogin");
      }, 2500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send registration request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          If your college isn’t listed yet, submit your registration request
          here. The Super Admin will review your details and activate your
          college account for the SIS portal.
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
              required
            />

            <input
              type="text"
              name="collegeName"
              placeholder="College Name *"
              value={formData.collegeName}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="College Address *"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
              required
            />

            <input
              type="url"
              name="logoUrl"
              placeholder="College Logo URL (optional)"
              value={formData.logoUrl}
              onChange={handleChange}
              disabled={isSubmitting}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Sending Request..."
                : "Send Request to Super Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
