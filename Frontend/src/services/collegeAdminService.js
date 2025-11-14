import apiClient from "./apiClient";
import { TOKEN_STORAGE_KEY } from "../config/constants";

const getAuthHeader = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** ADD COURSE */
export const addCourse = async (courseData) => {
  const response = await apiClient.post(
    "/api/v1/college/addCourse",
    courseData,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/** DELETE COURSE */
export const deleteCourse = async (courseId) => {
  const response = await apiClient.delete(
    `/api/v1/college/deleteCourse/${courseId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/** GET DASHBOARD DATA */
export const fetchDashboard = async () => {
  const response = await apiClient.get("/api/v1/college/dashboard", {
    headers: getAuthHeader(),
  });
  return response.data;
};

/** GET ALL COURSES FOR THIS COLLEGE */
export const fetchCourses = async () => {
  const response = await apiClient.get("/api/v1/college/courses", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default { addCourse, deleteCourse, fetchDashboard, fetchCourses };
