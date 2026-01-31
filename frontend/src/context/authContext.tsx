import { createContext, useContext, useState } from "react";
import { LoginApi, SignupApi } from "../api/auth.api";
import { setToken, getToken, removeToken } from "../utils/storage";

/* AuthContext Type */
type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Page refresh ke baad bhi login rahe
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!getToken()
  );

  /* LOGIN */
  const login = async (email: string, password: string) => {
    const data = await LoginApi(email, password);

    if (!data?.token) {
      throw new Error("Token not received from backend");
    }

    setToken(data.token);       // auth-token save
    setIsAuthenticated(true);   // user logged in
  };

  /* SIGNUP */
  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const data = await SignupApi(
      name,
      email,
      password,
      confirmPassword
    );

    if (!data?.token) {
      throw new Error("Token not received from backend");
    }

    setToken(data.token);
    setIsAuthenticated(true);
  };

  /* LOGOUT */
  const logout = () => {
    removeToken();              // token delete
    setIsAuthenticated(false);  // user logged out
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* Custom Hook */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

