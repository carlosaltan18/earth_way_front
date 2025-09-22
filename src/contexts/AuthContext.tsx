"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "ADMIN" | "USER" | "ORGANIZATION"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  roles: UserRole[]
  organizationId?: string
}

// Add new interface for reports
export interface Report {
  id: string
  title: string
  description: string
  date: string
  location: {
    lat: number
    lng: number
    address: string
  }
  authorId: string
  authorName: string
  done: boolean
  category: "pollution" | "deforestation" | "wildlife" | "waste"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isAuthenticated: boolean
  reports: Report[]
  setReports: React.Dispatch<React.SetStateAction<Report[]>>
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@earthway.com",
    password: "admin123",
    phone: "+1234567890",
    roles: ["ADMIN"],
  },
  {
    id: "2",
    name: "Usuario Regular",
    email: "user@earthway.com",
    password: "user123",
    phone: "+1234567891",
    roles: ["USER"],
  },
  {
    id: "3",
    name: "EcoOrg",
    email: "org@earthway.com",
    password: "org123",
    phone: "+1234567892",
    roles: ["ORGANIZATION"],
    organizationId: "1",
  },
]

// Add reports to mock data
const mockReports: Report[] = [
  {
    id: "1",
    title: "Contaminación Río Rímac",
    description: "Vertido de residuos industriales detectado en el sector norte del río",
    date: "2024-01-20",
    location: {
      lat: -12.03,
      lng: -77.08,
      address: "Río Rímac, Sector Industrial",
    },
    authorId: "1",
    authorName: "Admin Usuario",
    done: false,
    category: "pollution",
  },
  {
    id: "2",
    title: "Deforestación Ilegal",
    description: "Tala ilegal detectada en zona protegida",
    date: "2024-01-25",
    location: {
      lat: -12.2,
      lng: -77.1,
      address: "Zona Protegida Norte",
    },
    authorId: "1",
    authorName: "Admin Usuario",
    done: false,
    category: "deforestation",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [reports, setReports] = useState<Report[]>(mockReports)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("earthway_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("earthway_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      return false
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      roles: [userData.role],
    }

    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("earthway_user", JSON.stringify(userWithoutPassword))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("earthway_user")
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated,
        reports,
        setReports,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
