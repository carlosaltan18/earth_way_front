"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {jwtDecode} from "jwt-decode";
import { setAuthToken } from "../lib/axiosClient";

export type UserRole = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_ORGANIZATION";

export interface LoginResponse {
  payload: {
    token: string;
    expiresIn: number;
  };
  message: string;
}

export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  organizationId?: string;
  token: string;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
}

interface JwtPayload {
  sub: string;
  roles: { authority: string }[];
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = " https://earth-way-back.onrender.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("earthway_user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(parsedUser.token); // restaurar token en axios
      }
    } catch (error) {
      console.error("Error al cargar el usuario desde localStorage:", error);
    }
  }, []);

  const loginMutation = useMutation<LoginResponse, AxiosError, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.payload.token;
      const decoded: JwtPayload = jwtDecode(token);

      const user: User = {
        id: decoded.sub,
        name: decoded.sub.split("@")[0],
        email: decoded.sub,
        roles: decoded.roles.map((r) => r.authority as UserRole),
        token,
      };

      setUser(user);
      localStorage.setItem("earthway_user", JSON.stringify(user));
      setAuthToken(token);
    },
    onError: (error) => {
      console.error("Error en login:", error.response?.data || error.message);
    },
  });

  const registerMutation = useMutation<LoginResponse, AxiosError, RegisterData>({
  mutationFn: async (userData) => {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },
  onSuccess: (data) => {
    console.log("Respuesta registro:", data);

    const token = data?.payload?.token || (data as any)?.token;

    if (token) {
      // Si viene token, logueamos automáticamente
      const decoded: JwtPayload = jwtDecode(token);

      const user: User = {
        id: decoded.sub,
        name: decoded.sub.split("@")[0],
        email: decoded.sub,
        roles: decoded.roles.map((r) => r.authority as UserRole),
        token,
      };

      setUser(user);
      localStorage.setItem("earthway_user", JSON.stringify(user));
      setAuthToken(token);
    } else {
      // Si no hay token, solo avisamos y dejamos que el usuario haga login
      console.warn("Registro exitoso, pero no se recibió token. El usuario debe iniciar sesión manualmente.");
    }
  },
  onError: (error) => {
    console.error("Error en registro:", error.response?.data || error.message);
  },
});


  const login = async (email: string, password: string) => {
    if (!email || !password) return false;
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch {
      return false;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await registerMutation.mutateAsync(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("earthway_user");
    setAuthToken(""); // limpiar token en axios
  };

  const hasRole = (role: UserRole) => (user?.roles ?? []).includes(role);
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
