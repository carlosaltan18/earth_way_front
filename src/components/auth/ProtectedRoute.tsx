"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role))
      if (!hasRequiredRole) {
        router.push("/")
        return
      }
    }
  }, [isAuthenticated, hasRole, requiredRoles, router, redirectTo])

  if (!isAuthenticated) {
    return null
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role))
    if (!hasRequiredRole) {
      return null
    }
  }

  return <>{children}</>
}
