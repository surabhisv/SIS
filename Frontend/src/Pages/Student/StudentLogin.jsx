import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { fetchApprovedColleges } from "../../services/publicService";

export default function StudentLogin() {
  const nav = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(true);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      const data = await fetchApprovedColleges();
      setColleges(data || []);
    } catch (error) {
      console.error("Error loading colleges:", error);
      setError("Failed to load colleges. Please refresh the page.");
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleCollegeSelect = (e) => {
    const collegeId = e.target.value;
    setSelectedCollege(collegeId);

    if (collegeId === "NotListed") {
      setError("❌ College not registered. Please contact your admin.");
    } else {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedCollege) return setError("Please select your college first.");
    if (selectedCollege === "NotListed")
      return setError("College not registered.");
    if (!email || !password) return setError("Please fill all fields.");
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      if (!user.roles.includes("STUDENT")) {
        setError("This account is not registered as a student.");
        logout();
        return;
      }

      const target = location.state?.from?.pathname || "/student/dashboard";
      nav(target, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
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
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Form container */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          🎓 Student Login
        </h1>

        {/* College selection */}
        <label className="block text-gray-700 font-medium mb-2">
          Select Your College
        </label>
        <select
          value={selectedCollege}
          onChange={handleCollegeSelect}
          disabled={loadingColleges}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingColleges ? "Loading colleges..." : "-- Choose College --"}
          </option>
          {colleges.map((college) => (
            <option key={college.collegeId} value={college.collegeId}>
              {college.collegeName}
            </option>
          ))}
          <option value="NotListed">My College is not listed</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login form (only shows if valid college) */}
        {!error && selectedCollege && (
          <>
            <input
              type="email"
              placeholder="Email"
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

            <p className="text-sm text-gray-700 text-center mt-5">
              Not registered yet?{" "}
              <span
                onClick={() =>
                  nav("/student/register", {
                    state: {
                      college: selectedCollege,
                      collegeName: colleges.find(
                        (c) => c.collegeId === parseInt(selectedCollege)
                      )?.collegeName,
                    },
                  })
                }
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
