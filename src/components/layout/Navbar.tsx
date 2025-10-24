"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, Leaf, User, Settings, LogOut, Shield } from "lucide-react"

export default function Navbar() {
  const { user, logout, hasRole, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">EarthWay</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/posts" className="text-gray-700 hover:text-green-600 transition-colors">
              Publicaciones
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-green-600 transition-colors">
              Mapa
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/events" className="text-gray-700 hover:text-green-600 transition-colors">
                  Eventos
                </Link>
                <Link href="/organizations" className="text-gray-700 hover:text-green-600 transition-colors">
                  Organizaciones
                </Link>
                <Link href="/reports" className="text-gray-700 hover:text-green-600 transition-colors">
                  Reportes
                </Link>
                {
                  /**
                   * 
                   * 
                   *  <Link href="/map-events" className="text-gray-700 hover:text-green-600 transition-colors">
                         Mapa Eventos
                      </Link>
                      <Link href="/map-reports" className="text-gray-700 hover:text-green-600 transition-colors">
                        Mapa Reportes
                      </Link>
                   * 
                   */

                }
                {(hasRole("ROLE_ORGANIZATION")) && (
                  <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu & Mobile Button */}
          <div ref={menuRef} className="flex items-center space-x-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || "Usuario"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email || "Sin correo"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  {hasRole("ROLE_ADMIN") && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="px-2">
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="px-2">
                  <Link href="/auth/register">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white shadow-lg border-b z-40">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/posts" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Publicaciones</Link>
              <Link href="/map" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Mapa</Link>
              {isAuthenticated && (
                <>
                  <Link href="/events" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Eventos</Link>
                  <Link href="/organizations" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Organizaciones</Link>
                  <Link href="/reports" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Reportes</Link>
                  <Link href="/map-events" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Mapa Eventos</Link>
                  <Link href="/map-reports" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Mapa Reportes</Link>
                  {(hasRole("ROLE_ADMIN") || hasRole("ROLE_ORGANIZATION")) && (
                    <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  )}
                </>
              )}
              <div className="mt-2 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>Registrarse</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
