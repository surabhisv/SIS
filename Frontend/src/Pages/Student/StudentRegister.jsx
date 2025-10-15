import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StudentRegister() {
  const nav = useNavigate();
  const location = useLocation();

  // Get college from login
  const collegeFromLogin = location.state?.college || "";
  const [college] = useState(collegeFromLogin);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    //check for empty fields and password match
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess(true);
    setTimeout(() => {
      nav("/student/waiting-approval");
    }, 2000);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Compact Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8">
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6">
          📝 Student Registration
        </h1>

        {success ? (
          <p className="text-green-600 text-center font-medium text-lg">
            Registration successful! Redirecting to approval page...
          </p>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            />

            {/* College */}
            <input
              type="text"
              value={college}
              readOnly
              className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 mb-4 cursor-not-allowed text-sm"
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 text-sm"
            >
              Register
            </button>
          </form>
        )}

        <p className="text-xs text-gray-700 text-center mt-5">
          Already registered?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => nav("/student/Studentlogin")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
