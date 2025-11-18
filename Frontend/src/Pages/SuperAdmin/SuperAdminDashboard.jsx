import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // ⭐ added useLocation
import Layout from "../../components/Layout";
import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../../config/constants";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalColleges: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // ⭐ detect page navigation

  useEffect(() => {
    loadStats();
  }, [location.pathname]); // ⭐ re-run whenever dashboard becomes active

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      // 1️⃣ Fetch REQUESTS → pending + rejected + approved
      const requestsResponse = await axios.get(
        `${API_BASE_URL}/api/v1/superadmin/requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const requests = requestsResponse.data;

      const pending = requests.filter((r) => r.status === "PENDING").length;
      const rejected = requests.filter((r) => r.status === "REJECTED").length;
      const approved = requests.filter((r) => r.status === "APPROVED").length;

      // 2️⃣ Fetch COLLEGES → total colleges only
      const collegesResponse = await axios.get(
        `${API_BASE_URL}/api/v1/superadmin/colleges`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const totalColleges = collegesResponse.data.length;

      // 3️⃣ Update stats instantly
      setStats({
        totalColleges,
        approved,
        pending,
        rejected,
      });
    } catch (err) {
      console.error("Error loading super admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Approved Colleges",
      value: stats.approved,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "bg-green-500",
    },
    {
      title: "Pending Requests",
      value: stats.pending,
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
      color: "bg-yellow-500",
    },
    {
      title: "Rejected Requests",
      value: stats.rejected,
      icon: "M6 18L18 6M6 6l12 12",
      color: "bg-red-500",
    },
    {
      title: "Total Colleges",
      value: stats.totalColleges,
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16",
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <Layout role="superadmin" userName="Super Admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="superadmin" userName="Super Admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-purple-100">
            System-wide administration and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={stat.icon}
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Link
            to="/superadmin/colleges"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Manage Colleges</h3>
                <p className="text-sm text-gray-500">
                  Review and approve colleges
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;
