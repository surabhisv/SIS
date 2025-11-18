import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../config/constants";
import { fetchStudentProfile } from "../services/studentService";

const Sidebar = ({ role, userName = "User" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ name: userName, email: "" });

  useEffect(() => {
    const loadUserInfo = async () => {
      if (role === "student") {
        try {
          const profile = await fetchStudentProfile();
          setCurrentUser({
            name: profile.fullName || userName,
            email: profile.email || "",
          });
        } catch (error) {
          // Fallback to JWT token if API fails
          const userInfo = getUserInfoFromToken();
          setCurrentUser(userInfo);
        }
      } else {
        // For non-student roles, use JWT token
        const userInfo = getUserInfoFromToken();
        setCurrentUser(userInfo);
      }
    };

    loadUserInfo();
  }, [role]);

  // Extract user info from JWT token (fallback)
  const getUserInfoFromToken = () => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) return { email: "", name: userName };

      const parts = token.split(".");
      if (parts.length !== 3) return { email: "", name: userName };

      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const email = payload.sub || "";
      const name = payload.name || email.split("@")[0] || userName;
      return { email, name };
    } catch (error) {
      return { email: "", name: userName };
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClass =
      "flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200";
    return isActive(path)
      ? `${baseClass} bg-blue-100 text-blue-700 font-semibold`
      : `${baseClass} text-gray-700 hover:bg-gray-100`;
  };

  const studentLinks = [
    {
      path: "/student/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      label: "Dashboard",
    },
    {
      path: "/student/profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      label: "My Profile",
    },
    {
      path: "/student/courses",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      label: "Browse Courses",
    },
    {
      path: "/student/enrollments",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      label: "My Enrollments",
    },
  ];

  const adminLinks = [
    {
      path: "/admin/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      label: "Dashboard",
    },
    {
      path: "/admin/students",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      label: "Manage Students",
    },
    {
      path: "/admin/courses",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      label: "Manage Courses",
    },
    {
      path: "/admin/enrollments",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Approve Enrollments",
    },
  ];

  const superadminLinks = [
    {
      path: "/superadmin/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      label: "Dashboard",
    },
    {
      path: "/superadmin/colleges",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      label: "Manage Colleges",
    },
  ];

  const links =
    role === "student"
      ? studentLinks
      : role === "admin"
      ? adminLinks
      : role === "superadmin"
      ? superadminLinks
      : [];

  const getRoleName = () => {
    switch (role) {
      case "student":
        return "Student";
      case "admin":
        return "Admin";
      case "superadmin":
        return "Super Admin";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={getLinkClass(link.path)}
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
                  d={link.icon}
                />
              </svg>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-gray-200 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <svg
              className="w-6 h-6"
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {currentUser.name}
            </p>
            {currentUser.email && (
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
            )}
            <p className="text-xs text-gray-400">{getRoleName()}</p>
          </div>
        </div>

        {role === "student" && (
          <Link
            to="/student/profile"
            className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition duration-200"
          >
            <span>View Profile</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
