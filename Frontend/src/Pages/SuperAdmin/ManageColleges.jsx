import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import superAdminService from "../../services/superAdminService";

const ManageColleges = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  /** 🔥 Load requests + colleges */
  const loadData = async () => {
    try {
      setLoading(true);
      const requests = await superAdminService.fetchCollegeRequests();
      const colleges = await superAdminService.fetchAllColleges();

      const combined = requests.map((r) => {
        let collegeId = null;

        if (r.status === "APPROVED") {
          const match = colleges.find((c) => c.collegeName === r.collegeName);
          collegeId = match?.collegeId ?? null;
        }

        return {
          requestId: r.requestId,
          collegeId,
          collegeName: r.collegeName,
          address: r.address,
          status: r.status,
        };
      });

      setRequests(combined);
    } catch (err) {
      console.error("Error loading:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔥 INSTANT APPROVE WITH COLLEGE-ID UPDATE */
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this college?")) return;

    try {
      setActionLoading(`approve-${id}`);
      await superAdminService.approveCollegeRequest(id);

      // After approval, fetch latest colleges so we get the new collegeId
      const colleges = await superAdminService.fetchAllColleges();

      setRequests((prev) =>
        prev.map((r) => {
          if (r.requestId === id) {
            const match = colleges.find((c) => c.collegeName === r.collegeName);
            return {
              ...r,
              status: "APPROVED",
              collegeId: match?.collegeId ?? null,
            };
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Error approving:", err);
      alert("Failed to approve college");
    } finally {
      setActionLoading(null);
    }
  };

  /** 🔥 INSTANT REJECT */
  const handleReject = async (id) => {
    if (!window.confirm("Reject this college?")) return;

    try {
      setActionLoading(`reject-${id}`);
      await superAdminService.rejectCollegeRequest(id);

      setRequests((prev) =>
        prev.map((r) => (r.requestId === id ? { ...r, status: "REJECTED" } : r))
      );
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("Failed to reject college");
    } finally {
      setActionLoading(null);
    }
  };

  /** 🔥 INSTANT DELETE APPROVED COLLEGE */
  const handleDeleteCollege = async (collegeId) => {
    if (!window.confirm("Delete this approved college permanently?")) return;

    try {
      setActionLoading(`delete-${collegeId}`);
      await superAdminService.deleteCollege(collegeId);

      setRequests((prev) => prev.filter((r) => r.collegeId !== collegeId));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete college");
    } finally {
      setActionLoading(null);
    }
  };

  /** SEARCH + FILTER */
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ? true : r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout role="superadmin" userName="Super Admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading colleges...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="superadmin" userName="Super Admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Colleges</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-6 rounded-xl shadow-md">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-1/2"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
          >
            <option value="All">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 text-center">
              No college records found.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    College Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredRequests.map((r) => (
                  <tr key={r.requestId}>
                    <td className="px-6 py-4">{r.collegeName}</td>
                    <td className="px-6 py-4">{r.address}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : r.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {/* PENDING */}
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(r.requestId)}
                            disabled={actionLoading !== null}
                            className="bg-green-600 text-white text-sm px-3 py-1 rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === `approve-${r.requestId}`
                              ? "Approving..."
                              : "Approve"}
                          </button>

                          <button
                            onClick={() => handleReject(r.requestId)}
                            disabled={actionLoading !== null}
                            className="bg-red-600 text-white text-sm px-3 py-1 rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === `reject-${r.requestId}`
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </>
                      )}

                      {/* APPROVED */}
                      {r.status === "APPROVED" && (
                        <span className="text-gray-500 italic text-sm">
                          (No Actions Available)
                        </span>
                      )}


                      {/* REJECTED */}
                      {r.status === "REJECTED" && (
                        <span className="text-gray-400 italic text-sm">
                          (NA)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageColleges;
