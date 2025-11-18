import apiClient from "./apiClient";

/** STUDENT REGISTRATION (No Auth Required) */
export const registerStudent = async (studentData) => {
  const response = await apiClient.post(
    "/api/v1/student/register",
    studentData
  );
  return response.data;
};

/** GET STUDENT DASHBOARD */
export const fetchStudentDashboard = async () => {
  const response = await apiClient.get("/api/v1/student/dashboard");
  return response.data;
};

/** GET STUDENT PROFILE */
export const fetchStudentProfile = async () => {
  const response = await apiClient.get("/api/v1/student/profile");
  return response.data;
};

/** UPDATE STUDENT PROFILE */
export const updateStudentProfile = async (profileData) => {
  const response = await apiClient.put("/api/v1/student/profile", profileData);
  return response.data;
};

/** GET ALL AVAILABLE COURSES FOR STUDENT */
export const fetchAvailableCourses = async () => {
  const response = await apiClient.get("/api/v1/student/courses");
  return response.data;
};

/** ENROLL IN A COURSE */
export const enrollInCourse = async (courseId) => {
  const response = await apiClient.post("/api/v1/student/enroll", { courseId });
  return response.data;
};

/** GET STUDENT ENROLLMENT HISTORY */
export const fetchStudentEnrollments = async () => {
  const response = await apiClient.get("/api/v1/student/enrollments");
  return response.data;
};

export default {
  registerStudent,
  fetchStudentDashboard,
  fetchStudentProfile,
  updateStudentProfile,
  fetchAvailableCourses,
  enrollInCourse,
  fetchStudentEnrollments,
};
