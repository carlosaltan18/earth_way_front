"use client"

import type React from "react"
import Navbar from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
