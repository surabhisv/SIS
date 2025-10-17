// Simple service without authentication
class AuthService {
  // Direct login without validation
  login(email, password, role) {
    return { success: true, role };
  }

  // Simple logout
  logout() {
    return { success: true };
  }

  // Always return null - no user tracking
  getCurrentUser() {
    return null;
  }

  // Always return true - no authentication required
  isAuthenticated() {
    return true;
  }

  // Always return true - no role checking
  hasRole(role) {
    return true;
  }
}

export default new AuthService();
