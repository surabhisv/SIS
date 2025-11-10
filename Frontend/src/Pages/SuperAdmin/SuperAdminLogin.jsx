import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // navigation to portal page on login
    nav("/superadmin/dashboard");
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

          {/* Login Button */}
          <button
            type="submit"
            className="mt-3 relative overflow-hidden px-6 py-2.5 rounded-2xl font-semibold text-white shadow-lg
              bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500
              hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-600
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
              group"
          >
            <span className="relative z-10">Login</span>
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
