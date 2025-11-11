import { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import dataService from "../../services/dataService";

const StudentEnrollments = () => {
  // Mock current user
  const currentUser = { id: "S1001", studentId: "S1001", name: "Sneha Rao" };

  const [enrollments, setEnrollments] = useState([]);

  const loadEnrollments = useCallback(() => {
    const myEnrollments = dataService.getEnrollmentsByStudent(currentUser.id);
    const allCourses = dataService.getAll("courses");

    console.log("My enrollments:", myEnrollments); // Debug log
    console.log("All courses:", allCourses); // Debug log

    const enrichedEnrollments = myEnrollments.map((e) => {
      const course = allCourses.find(
        (c) => (c.course_id || c.id) === (e.course_id || e.courseId)
      );
      console.log(`Enrollment ${e.enrollment_id}: course found:`, course); // Debug log
      return { ...e, course };
    });

    console.log("Enriched enrollments:", enrichedEnrollments); // Debug log
    setEnrollments(enrichedEnrollments);
  }, [currentUser.id]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const getStatusBadge = (status) => {
    const colors = {
      REQUESTED: "bg-yellow-100 text-yellow-800",
      Pending: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      Approved: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return `px-3 py-1 rounded-full text-sm font-semibold ${
      colors[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  const columns = [
    {
      header: "Course ID",
      accessor: "course",
      render: (row) => row.course?.course_id || row.course?.id || "N/A",
    },
    {
      header: "Course Name",
      accessor: "course",
      render: (row) => row.course?.course_name || row.course?.name || "N/A",
    },
    {
      header: "Description",
      accessor: "course",
      render: (row) => {
        const desc = row.course?.description || "N/A";
        return desc.length > 50 ? desc.substring(0, 50) + "..." : desc;
      },
    },
    {
      header: "Credits",
      accessor: "course",
      render: (row) => row.course?.credits || "N/A",
    },
    {
      header: "Request Date",
      accessor: "requested_at",
      render: (row) =>
        row.requested_at
          ? new Date(row.requested_at).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={getStatusBadge(row.status)}>
          {row.status || "UNKNOWN"}
        </span>
      ),
    },
  ];

  const stats = {
    total: enrollments.length,
    approved: enrollments.filter(
      (e) => e.status === "Approved" || e.status === "APPROVED"
    ).length,
    pending: enrollments.filter(
      (e) => e.status === "Pending" || e.status === "REQUESTED"
    ).length,
    rejected: enrollments.filter(
      (e) => e.status === "Rejected" || e.status === "REJECTED"
    ).length,
  };

  return (
    <Layout userName={currentUser.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Enrollments</h1>
          <p className="text-gray-600 mt-1">
            Track your course enrollment requests and status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Enrollment History
          </h2>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No enrollment history
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <Table columns={columns} data={enrollments} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentEnrollments;
