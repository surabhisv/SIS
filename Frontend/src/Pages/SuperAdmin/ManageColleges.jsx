import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import superAdminService from "../../services/superAdminService";

const ManageColleges = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await superAdminService.fetchCollegeRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error loading college requests:", err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this college?")) return;
    await superAdminService.approveCollegeRequest(id);
    loadRequests();
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this college?")) return;
    await superAdminService.rejectCollegeRequest(id);
    loadRequests();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this college permanently?")) return;
    await superAdminService.deleteCollegeRequest(id);
    loadRequests();
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.collegeName?.toLowerCase().includes(search.toLowerCase()) ||
      r.adminEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ? true : r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout role="superadmin" userName="Super Admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Colleges</h1>
        <p className="text-gray-600">Approve or reject college registration requests</p>

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
            <p className="text-gray-500 text-center">No college requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRequests.map((r) => (
                    <tr key={r.requestId}>
                      <td className="px-6 py-4">{r.collegeName}</td>
                      <td className="px-6 py-4">{r.adminEmail}</td>
                      <td className="px-6 py-4">{r.address}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            r.status === "APPROVED"
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
                        {r.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(r.requestId)}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r.requestId)}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded mr-2"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(r.requestId)}
                          className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageColleges;
