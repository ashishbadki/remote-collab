// src/context/authContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { LoginApi, SignupApi } from "../api/auth.api";
import { getProfileApi } from "../api/user.api";
import { setToken, getToken, removeToken } from "../utils/storage";

type UserType = {
  _id?: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* LOAD USER ON APP START / REFRESH */
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!getToken()) {
          setLoading(false);
          return;
        }

        const data = await getProfileApi();
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* LOGIN */
  const login = async (email: string, password: string) => {
    const data = await LoginApi(email, password);

    if (!data?.token) {
      throw new Error("Token not received from backend");
    }

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  /* SIGNUP */
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

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  /* LOGOUT */
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
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
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
