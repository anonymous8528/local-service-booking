import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // `data` is the AuthResponse from the backend: { token, id, name, email, role }
  function login(data) {
    localStorage.setItem("token", data.token);
    const { token, ...profile } = data;
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
