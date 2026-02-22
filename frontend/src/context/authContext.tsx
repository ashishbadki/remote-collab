import { createContext, useContext, useEffect, useState } from "react";
import { LoginApi, SignupApi } from "../api/auth.api";
import { getProfileApi } from "../api/user.api";
import { setToken as storeToken, getToken, removeToken } from "../utils/storage";

type UserType = {
  _id?: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
  token: string | null;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileApi();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token invalid. Logging out.");
        removeToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // 🔹 LOGIN
  const login = async (email: string, password: string) => {
    const data = await LoginApi(email, password);

    if (!data?.token) {
      throw new Error("Token not received from backend");
    }

    storeToken(data.token);
    setToken(data.token);

    const profile = await getProfileApi();
    setUser(profile.user);
    setIsAuthenticated(true);
  };

  // 🔹 SIGNUP
  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const data = await SignupApi(name, email, password, confirmPassword);

    if (!data?.token) {
      throw new Error("Token not received from backend");
    }

    storeToken(data.token);
    setToken(data.token);

    const profile = await getProfileApi();
    setUser(profile.user);
    setIsAuthenticated(true);
  };

  // 🔹 LOGOUT
  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};