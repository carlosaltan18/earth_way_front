"use client"

import type React from "react"

import { useRouter } from "next/navigation";
import type { UserType } from "@/features/user/types"
import { useDeleteCurrentUser, useUpdateCurrentUser, useChangePassword } from "@/features/user/queries"
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
  const router = useRouter();


  // Mutation para actualizar usuario
  const { mutateAsync: updatePassword } = useChangePassword();

  //Mutation para actualizar usuario
  const { mutateAsync: updateUser } = useUpdateCurrentUser();

  // Mutation para eliminar usuario actual
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteCurrentUser();

  // Personal info form state
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  })


  const [userStats] = useState<UserStats>(mockUserStats)

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await updateUser({
        name: personalInfo.name,
        surname: personalInfo.surname,
        email: personalInfo.email,
        phone: personalInfo.phone,
      });

      setPersonalInfo({
        name: user?.name || "",
        surname: user?.surname || "",
        email: user?.email || "",
        phone: user?.phone || "",
      })
      

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
      await updatePassword({
        newPassword: passwordForm.newPassword, // si tu payload lo requiere
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({
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

  const handleDeleteAccount = () => {
    setIsLoading(true)

    deleteUser(undefined, {
      onSuccess: () => {
        toast({
          title: "Cuenta eliminada",
          description: "Tu cuenta ha sido eliminada exitosamente.",
        })

        // Logout y redirección
        logout()
        router.push("/auth/register");

      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo eliminar tu cuenta. Intenta de nuevo.",
          variant: "destructive",
        })
      },
      onSettled: () => {
        setIsLoading(false)
      },
    })
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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Gestiona tu información personal y configuración de cuenta</p>
          </div>

          {/* Profile Header */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback className="text-xl sm:text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600 break-all">{user.email}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role === "ROLE_ADMIN" ? "Administrador" : role === "ROLE_ORGANIZATION" ? "Organización" : "Usuario"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="personal" className="text-xs sm:text-sm py-2 px-2">
                <span className="hidden sm:inline">Información Personal</span>
                <span className="sm:hidden">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="text-xs sm:text-sm py-2 px-2">Contraseña</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 px-2">
                <span className="hidden sm:inline">Eliminar Cuenta</span>
                <span className="sm:hidden">Eliminar</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Actualiza tu información personal y de contacto</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">Nombre completo</Label>
                        <Input
                          id="name"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Tu nombre completo"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname" className="text-sm">Apellido</Label>
                        <Input
                          id="surname"
                          value={personalInfo.surname}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, surname: e.target.value }))}
                          placeholder="Tu apellido"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="tu@email.com"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="00000000"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm">Roles</Label>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role === "ROLE_ADMIN"
                                ? "Administrador"
                                : role === "ROLE_ORGANIZATION"
                                  ? "Organización"
                                  : "Usuario"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-sm">
                        {isLoading ? (
                          <>Guardando...</>
                        ) : (
                          <>
                            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm">Nueva contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Nueva contraseña (mínimo 6 caracteres)"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm">Confirmar nueva contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirma tu nueva contraseña"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-xs sm:text-sm">
                        Tu contraseña debe tener al menos 6 caracteres. Te recomendamos usar una combinación de letras,
                        números y símbolos.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-sm">
                        {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-4 sm:space-y-6">
                {/* Danger Zone */}
                <Card className="border-red-200">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-red-600 flex items-center gap-2 text-lg sm:text-xl">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Zona de Peligro
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Acciones irreversibles que afectarán permanentemente tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs sm:text-sm">
                          <strong>¡Atención!</strong> Eliminar tu cuenta es una acción permanente. Se perderán todos tus
                          datos, publicaciones y participación en eventos.
                        </AlertDescription>
                      </Alert>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full text-sm">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Eliminar mi cuenta
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">
                              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta, incluyendo:
                              <br />
                              <br />• Tu información de perfil y configuraciones
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto text-sm">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-sm"
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
              <div className="grid gap-4 sm:gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xl sm:text-2xl font-bold">{userStats.postsCount}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Publicaciones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xl sm:text-2xl font-bold">{userStats.eventsJoined}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Eventos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xl sm:text-2xl font-bold">{userStats.organizationsFollowed}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Organizaciones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-xl sm:text-2xl font-bold">{userStats.reportsSubmitted}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Reportes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}