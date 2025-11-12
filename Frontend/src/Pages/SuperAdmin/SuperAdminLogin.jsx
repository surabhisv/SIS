import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      // Handle both array or string roles
const roles = Array.isArray(user.roles)
  ? user.roles
  : typeof user.roles === "string"
  ? user.roles.split(",")
  : [];

if (!roles.includes("SUPERADMIN")) {
  setError("You do not have Super Admin access.");
  logout();
  return;
}

  const target = location.state?.from?.pathname || "/superadmin/dashboard";
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-sm p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-5 text-center">
          Super Admin Login
        </h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm transition duration-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-200 mb-1 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm transition duration-300"
            />
          </div>

          {error && (
            <p className="text-red-200 text-sm text-center" role="alert">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 relative overflow-hidden px-6 py-2.5 rounded-2xl font-semibold text-white shadow-lg
              bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500
              hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-600
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed
              group"
          >
            <span className="relative z-10">
              {isSubmitting ? "Signing in..." : "Login"}
            </span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-30 blur-lg transition duration-300"></span>
          </button>
        </form>

        <p className="text-gray-300 text-xs mt-5 text-center">
          Secure access for Super Admin only
        </p>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
