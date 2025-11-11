import { createContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredToken,
  extractUserFromToken,
  getStoredToken,
  isTokenValid,
  login,
  storeToken,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: null,
    user: null,
    roles: [],
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const existingToken = getStoredToken();

    if (existingToken && isTokenValid(existingToken)) {
      const user = extractUserFromToken(existingToken);

      if (user) {
        setState({
          token: existingToken,
          user,
          roles: user.roles,
        });
      } else {
        clearStoredToken();
      }
    } else {
      clearStoredToken();
    }

    setIsReady(true);
  }, []);

  const handleLogin = async (credentials) => {
    const token = await login(credentials);

    if (!token) {
      throw new Error("Authentication failed");
    }

    if (!isTokenValid(token)) {
      throw new Error("Received expired token");
    }

    const user = extractUserFromToken(token);

    if (!user) {
      throw new Error("Unable to read user information from token");
    }

    storeToken(token);
    setState({ token, user, roles: user.roles });

    return user;
  };

  const handleLogout = () => {
    clearStoredToken();
    setState({ token: null, user: null, roles: [] });
  };

  const value = useMemo(
    () => ({
      token: state.token,
      user: state.user,
      roles: state.roles,
      isReady,
      isAuthenticated: Boolean(state.token),
      login: handleLogin,
      logout: handleLogout,
      hasRole: (role) => state.roles.includes(role),
      hasAnyRole: (allowedRoles = []) =>
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => state.roles.includes(role)),
    }),
    [isReady, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
