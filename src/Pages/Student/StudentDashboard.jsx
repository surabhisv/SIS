import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import dataService from "../../services/dataService";

const StudentDashboard = () => {
  // Mock current user - hardcoded student data
  const currentUser = {
    id: "S001",
    firstName: "Alice",
    gpa: 3.7,
  };

  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allEnrollments = dataService.getEnrollmentsByStudent(currentUser.id);
    const allCourses = dataService.getAll("courses");

    const enrolledCourses = allEnrollments
      .filter((e) => e.status === "Approved")
      .map((e) => {
        const course = allCourses.find((c) => c.id === e.courseId);
        return { ...e, course };
      });

    setEnrollments(enrolledCourses);
    setCourses(allCourses);
  };

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments.length,
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "bg-blue-500",
    },
    {
      title: "Total Credits",
      value: enrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0),
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      color: "bg-green-500",
    },
    // {
    //   title: "GPA",
    //   value: currentUser.gpa || "N/A",
    //   icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    //   color: "bg-yellow-500",
    // },
    {
      title: "Available Courses",
      value: courses.filter((c) => c.status === "Open").length,
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      color: "bg-purple-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser.firstName}!
          </h1>
          <p className="text-blue-100">
            Here's what's happening with your academic journey today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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

        {/* Current Enrollments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Current Enrollments
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses enrolled
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by browsing available courses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.slice(0, 4).map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {enrollment.course?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {enrollment.course?.code}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {enrollment.course?.instructor}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {enrollment.course?.credits} Credits
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {enrollment.course?.schedule}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/student/courses"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-3 transition duration-200">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Browse Courses</h3>
                <p className="text-sm text-gray-500">Find new courses</p>
              </div>
            </div>
          </a>

          <a
            href="/student/profile"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 group-hover:bg-green-200 rounded-lg p-3 transition duration-200">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">My Profile</h3>
                <p className="text-sm text-gray-500">View and edit profile</p>
              </div>
            </div>
          </a>

          <a
            href="/student/enrollments"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 group-hover:bg-purple-200 rounded-lg p-3 transition duration-200">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <div>
                <h3 className="font-semibold text-gray-800">Enrollments</h3>
                <p className="text-sm text-gray-500">Track your requests</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
