import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

const ManageColleges = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const data = JSON.parse(localStorage.getItem("collegeRequests")) || [];
    setRequests(data);
  };

  // ✅ Filtered and searched data
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      r.adminEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ? true : r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: "Approved" } : r
    );

    const approvedCollege = requests.find((r) => r.id === id);

    localStorage.setItem("collegeRequests", JSON.stringify(updated));
    setRequests(updated);

    const approved = JSON.parse(localStorage.getItem("approvedColleges")) || [];
    if (!approved.find((c) => c.collegeName === approvedCollege.collegeName)) {
      localStorage.setItem(
        "approvedColleges",
        JSON.stringify([...approved, approvedCollege])
      );
    }
  };

  const handleReject = (id) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: "Rejected" } : r
    );
    localStorage.setItem("collegeRequests", JSON.stringify(updated));
    setRequests(updated);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this request permanently?")) return;

    const updated = requests.filter((r) => r.id !== id);
    localStorage.setItem("collegeRequests", JSON.stringify(updated));
    setRequests(updated);
  };

  return (
    <Layout role="superadmin" userName="Super Admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Colleges</h1>
          <p className="text-gray-600 mt-1">
            Review, filter, search, approve, or delete college registration
            requests
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between gap-4">
          {/* ✅ Search Input */}
          <input
            type="text"
            placeholder="Search by college name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-1/2"
          />

          {/* ✅ Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Requests Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Icon + Info */}
          <div className="text-center mb-8">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4a2 2 0 114 0v2m-4 0H6m6 0h6m-6 0v12m0 0H6m6 0h6"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              College Registration Requests
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Filter by status or search by name/email.
            </p>
          </div>

          {/* Table */}
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No matching college requests found.
            </p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      College Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Admin Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Website
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
                    <tr key={r.id}>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.collegeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.adminEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.website || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            r.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : r.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {r.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => handleReject(r.id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(r.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
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
