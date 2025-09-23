"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, FileText, Building, AlertTriangle, Shield, TrendingUp, Activity, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock dashboard data
const dashboardStats = {
  totalUsers: 2847,
  totalEvents: 156,
  totalPosts: 423,
  totalOrganizations: 89,
  pendingReports: 12,
  activeEvents: 23,
}

const recentActivity = [
  {
    id: "1",
    type: "user_registered",
    description: "Nuevo usuario registrado: María González",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "event_created",
    description: "Evento creado: Limpieza Playa Norte",
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    type: "report_submitted",
    description: "Nuevo reporte: Contaminación Río Sur",
    timestamp: "2024-01-15T08:45:00Z",
  },
]

export default function DashboardPage() {
  const { user, hasRole } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!hasRole("ROLE_ADMIN") && !hasRole("ROLE_ORGANIZATION")) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
              <p className="text-gray-600">No tienes permisos para acceder al dashboard administrativo.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_ORGANIZATION"]}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">Panel de control para gestión de la plataforma</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="posts">Publicaciones</TabsTrigger>
              <TabsTrigger value="organizations">Organizaciones</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12%</span> desde el mes pasado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activeEvents}</div>
                    <p className="text-xs text-muted-foreground">{dashboardStats.totalEvents} eventos totales</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Publicaciones</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalPosts}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8%</span> esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organizaciones</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalOrganizations}</div>
                    <p className="text-xs text-muted-foreground">Organizaciones registradas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reportes Pendientes</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{dashboardStats.pendingReports}</div>
                    <p className="text-xs text-muted-foreground">Requieren atención</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <p className="text-xs text-muted-foreground">Participación mensual</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription>Últimas acciones en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administra usuarios registrados en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasRole("ROLE_ADMIN") ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Lista de Usuarios</h3>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Usuario Organización
                        </Button>
                      </div>
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Funcionalidad de gestión de usuarios en desarrollo</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Aquí podrás crear usuarios con rol ORGANIZATION, eliminar perfiles y gestionar roles
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Solo administradores pueden gestionar usuarios</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Eventos</CardTitle>
                  <CardDescription>Administra eventos ambientales de la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Funcionalidad de gestión de eventos en desarrollo</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Publicaciones</CardTitle>
                  <CardDescription>Modera y administra publicaciones de la comunidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Funcionalidad de gestión de publicaciones en desarrollo</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Organizaciones</CardTitle>
                  <CardDescription>Administra organizaciones registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Funcionalidad de gestión de organizaciones en desarrollo</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Reportes</CardTitle>
                  <CardDescription>Revisa y gestiona reportes ambientales</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasRole("ROLE_ADMIN") ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Reportes Ambientales</h3>
                        <Button asChild>
                          <Link href="/reports">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Ver Todos los Reportes
                          </Link>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-600">12</div>
                            <p className="text-sm text-gray-600">Reportes Pendientes</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">8</div>
                            <p className="text-sm text-gray-600">Reportes Resueltos</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-orange-600">3</div>
                            <p className="text-sm text-gray-600">Alta Prioridad</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Solo administradores pueden gestionar reportes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
