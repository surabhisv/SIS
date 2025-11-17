import apiClient from "./apiClient";

/** GET ALL DEPARTMENTS */
export const fetchDepartments = async () => {
  const response = await apiClient.get("/api/v1/public/departments");
  return response.data;
};

/** GET ALL APPROVED COLLEGES */
export const fetchApprovedColleges = async () => {
  const response = await apiClient.get("/api/v1/public/colleges");
  return response.data;
};

export default {
  fetchDepartments,
  fetchApprovedColleges,
};
