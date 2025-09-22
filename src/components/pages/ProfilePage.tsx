"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Shield,
  Key,
  Trash2,
  Save,
  Calendar,
  FileText,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface UserStats {
  postsCount: number
  eventsJoined: number
  organizationsFollowed: number
  reportsSubmitted: number
  joinDate: string
}

// Mock user stats
const mockUserStats: UserStats = {
  postsCount: 12,
  eventsJoined: 8,
  organizationsFollowed: 3,
  reportsSubmitted: 2,
  joinDate: "2023-06-15",
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)

  // Personal info form state
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
  })

  const [userStats] = useState<UserStats>(mockUserStats)

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Perfil actualizado",
        description: "Tu información personal ha sido actualizada exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar tu información. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar tu contraseña. Verifica tu contraseña actual.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada exitosamente.",
      })

      // Logout and redirect
      logout()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar tu cuenta. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role === "ADMIN" ? "Administrador" : role === "ORGANIZATION" ? "Organización" : "Usuario"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Miembro desde</p>
                  <p className="font-medium">{new Date(userStats.joinDate).toLocaleDateString("es-ES")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1234567890"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Roles</Label>
                        <div className="flex gap-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role === "ADMIN"
                                ? "Administrador"
                                : role === "ORGANIZATION"
                                  ? "Organización"
                                  : "Usuario"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>Guardando...</>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                  <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Contraseña actual</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Tu contraseña actual"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nueva contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Nueva contraseña (mínimo 6 caracteres)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirma tu nueva contraseña"
                        />
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Tu contraseña debe tener al menos 6 caracteres. Te recomendamos usar una combinación de letras,
                        números y símbolos.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                    <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notificaciones por email</Label>
                            <p className="text-sm text-gray-500">Recibe actualizaciones importantes por correo</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={accountSettings.emailNotifications}
                            onChange={(e) =>
                              setAccountSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                            }
                            className="h-4 w-4"
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Recordatorios de eventos</Label>
                            <p className="text-sm text-gray-500">
                              Recibe recordatorios de eventos a los que te has unido
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={accountSettings.eventReminders}
                            onChange={(e) =>
                              setAccountSettings((prev) => ({ ...prev, eventReminders: e.target.checked }))
                            }
                            className="h-4 w-4"
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Emails promocionales</Label>
                            <p className="text-sm text-gray-500">Recibe noticias y promociones de EarthWay</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={accountSettings.marketingEmails}
                            onChange={(e) =>
                              setAccountSettings((prev) => ({ ...prev, marketingEmails: e.target.checked }))
                            }
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Guardando..." : "Guardar Preferencias"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Zona de Peligro
                    </CardTitle>
                    <CardDescription>Acciones irreversibles que afectarán permanentemente tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>¡Atención!</strong> Eliminar tu cuenta es una acción permanente. Se perderán todos tus
                          datos, publicaciones y participación en eventos.
                        </AlertDescription>
                      </Alert>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar mi cuenta
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y removerá
                              todos tus datos de nuestros servidores, incluyendo:
                              <br />
                              <br />• Todas tus publicaciones ({userStats.postsCount})
                              <br />• Tu participación en eventos ({userStats.eventsJoined})
                              <br />• Tus reportes ambientales ({userStats.reportsSubmitted})
                              <br />• Tu información de perfil y configuraciones
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isLoading}
                            >
                              {isLoading ? "Eliminando..." : "Sí, eliminar mi cuenta"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="grid gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{userStats.postsCount}</p>
                          <p className="text-sm text-gray-600">Publicaciones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{userStats.eventsJoined}</p>
                          <p className="text-sm text-gray-600">Eventos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{userStats.organizationsFollowed}</p>
                          <p className="text-sm text-gray-600">Organizaciones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{userStats.reportsSubmitted}</p>
                          <p className="text-sm text-gray-600">Reportes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Te uniste al evento "Reforestación Cerro Verde"</p>
                          <p className="text-sm text-gray-500">Hace 2 días</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Publicaste "Mi experiencia en limpieza de playa"</p>
                          <p className="text-sm text-gray-500">Hace 5 días</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Comenzaste a seguir a "EcoLima"</p>
                          <p className="text-sm text-gray-500">Hace 1 semana</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
