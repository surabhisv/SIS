import apiClient from "./apiClient";
import { TOKEN_STORAGE_KEY } from "../config/constants";

/**
 * Helper: Get Authorization header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all college registration requests.
 * (GET /api/v1/superadmin/requests)
 */
export const fetchCollegeRequests = async () => {
  const response = await apiClient.get("/api/v1/superadmin/requests", {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Approve a college registration request.
 * (PUT /api/v1/superadmin/requests/{requestId}/approve)
 */
export const approveCollegeRequest = async (requestId) => {
  const response = await apiClient.put(
    `/api/v1/superadmin/requests/${requestId}/approve`,
    null,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Reject a college registration request.
 * (PUT /api/v1/superadmin/requests/{requestId}/reject)
 */
export const rejectCollegeRequest = async (requestId) => {
  const response = await apiClient.put(
    `/api/v1/superadmin/requests/${requestId}/reject`,
    null,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Delete a college registration request.
 * (DELETE /api/v1/superadmin/requests/{requestId})
 */
export const deleteCollegeRequest = async (requestId) => {
  const response = await apiClient.delete(
    `/api/v1/superadmin/requests/${requestId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Fetch all colleges in the system.
 * (GET /api/v1/superadmin/colleges)
 */
export const fetchAllColleges = async () => {
  const response = await apiClient.get("/api/v1/superadmin/colleges", {
    headers: getAuthHeader(),
  });
  return response.data;
};



export default {
  fetchCollegeRequests,
  approveCollegeRequest,
  rejectCollegeRequest,
  deleteCollegeRequest,
  fetchAllColleges,
};
