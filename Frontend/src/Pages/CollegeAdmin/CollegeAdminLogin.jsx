import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function CollegeAdminLogin() {
  const nav = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const colleges = [
    "Tech University",
    "Global Institute",
    "Bright Future College",
  ];

  const [selectedCollege, setSelectedCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCollegeSelect = (e) => {
    const college = e.target.value;
    setSelectedCollege(college);

    if (college && !colleges.includes(college)) {
      setError("❌ College not registered. Please send a request to Super Admin.");
    } else {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedCollege) return setError("Please select your college first.");
    if (!colleges.includes(selectedCollege))
      return setError("College not registered.");
    if (!email || !password) return setError("Please fill all fields.");
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      if (!user.roles.includes("ADMIN")) {
        setError("This account is not approved for college administration.");
        logout();
        return;
      }

      const target =
        location.state?.from?.pathname || "/CollegeAdmin/CollegeAdminDashboard";
      nav(target, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Login failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm mx-4">
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6">
          🏫 College Admin Login
        </h1>

        <label className="block text-gray-700 font-medium mb-2">
          Select Your College
        </label>
        <select
          value={selectedCollege}
          onChange={handleCollegeSelect}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
          <option value="">-- Choose College --</option>
          {colleges.map((clg) => (
            <option key={clg} value={clg}>
              {clg}
            </option>
          ))}
          <option value="NotListed">My College is not listed</option>
        </select>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Login form only for approved colleges */}
        {!error && selectedCollege && (
          <>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </>
        )}

        {/* Redirect option for unlisted colleges */}
        {selectedCollege === "NotListed" && (
          <div className="text-center mt-4">
            <button
              onClick={() => nav("/CollegeAdmin/CollegeAdminRequest")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              ➕ Request College Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
