"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Calendar,
  FileText,
  Building,
  AlertTriangle,
  Shield,
  TrendingUp,
  Activity,
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
import type { UserRole } from "@/contexts/AuthContext"

// Interfaces
interface DashboardUser {
  id: string
  name: string
  email: string
  phone?: string
  roles: UserRole[]
  organizationId?: string
  createdAt: string
}

interface DashboardEvent {
  id: string
  name: string
  description: string
  date: string
  location: string
  organizationId: string
  organizationName: string
  participants: number
  maxParticipants?: number
  category: "reforestation" | "cleanup" | "education" | "conservation"
  finished: boolean
}

interface DashboardPost {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  postDate: string
}

interface DashboardOrganization {
  id: string
  name: string
  description: string
  email: string
  phone?: string
  address?: string
  category: "ngo" | "government" | "private" | "community"
  members: number
  eventsCount: number
  founded: string
}

interface DashboardReport {
  id: string
  title: string
  description: string
  date: string
  address: string
  authorId: string
  authorName: string
  done: boolean
  category: "pollution" | "deforestation" | "wildlife" | "waste"
  severity: "low" | "medium" | "high"
}

// Mock data
const mockUsers: DashboardUser[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@earthway.com",
    phone: "+1234567890",
    roles: ["ROLE_ADMIN"],
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Usuario Regular",
    email: "user@earthway.com",
    phone: "+1234567891",
    roles: ["ROLE_USER"],
    createdAt: "2023-06-20",
  },
  {
    id: "3",
    name: "EcoOrg",
    email: "org@earthway.com",
    phone: "+1234567892",
    roles: ["ROLE_ORGANIZATION"],
    organizationId: "1",
    createdAt: "2023-03-10",
  },
]

const mockEvents: DashboardEvent[] = [
  {
    id: "1",
    name: "Reforestación Cerro Verde",
    description: "Jornada de plantación de árboles nativos",
    date: "2024-02-15",
    location: "Cerro Verde, Lima",
    organizationId: "1",
    organizationName: "EcoLima",
    participants: 25,
    maxParticipants: 50,
    category: "reforestation",
    finished: false,
  },
  {
    id: "2",
    name: "Limpieza Playa Costa Verde",
    description: "Actividad de limpieza costera",
    date: "2024-02-20",
    location: "Costa Verde, Miraflores",
    organizationId: "2",
    organizationName: "OceanGuard",
    participants: 18,
    maxParticipants: 30,
    category: "cleanup",
    finished: false,
  },
]

const mockPosts: DashboardPost[] = [
  {
    id: "1",
    title: "Reforestación en el Parque Nacional",
    content: "Hoy participamos en una jornada increíble...",
    authorId: "1",
    authorName: "Admin Usuario",
    postDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Limpieza de Playa Comunitaria",
    content: "Organizamos una limpieza de playa...",
    authorId: "2",
    authorName: "Usuario Regular",
    postDate: "2024-01-10",
  },
]

const mockOrganizations: DashboardOrganization[] = [
  {
    id: "1",
    name: "EcoLima",
    description: "Organización dedicada a la reforestación urbana",
    email: "contacto@ecolima.org",
    phone: "+51 1 234-5678",
    address: "Av. Arequipa 1234, Lima",
    category: "ngo",
    members: 150,
    eventsCount: 25,
    founded: "2018-03-15",
  },
  {
    id: "2",
    name: "OceanGuard",
    description: "Protegemos nuestros océanos y costas",
    email: "info@oceanguard.pe",
    phone: "+51 1 987-6543",
    address: "Malecón Costa Verde",
    category: "ngo",
    members: 89,
    eventsCount: 18,
    founded: "2020-07-22",
  },
]

const mockReports: DashboardReport[] = [
  {
    id: "1",
    title: "Contaminación Río Rímac",
    description: "Vertido de residuos industriales",
    date: "2024-01-20",
    address: "Río Rímac, Sector Industrial",
    authorId: "1",
    authorName: "Admin Usuario",
    done: false,
    category: "pollution",
    severity: "high",
  },
  {
    id: "2",
    title: "Deforestación Ilegal",
    description: "Tala ilegal en zona protegida",
    date: "2024-01-25",
    address: "Zona Protegida Norte",
    authorId: "1",
    authorName: "Admin Usuario",
    done: false,
    category: "deforestation",
    severity: "high",
  },
]

const dashboardStats = {
  totalUsers: 2847,
  totalEvents: 156,
  totalPosts: 423,
  totalOrganizations: 89,
  pendingReports: 12,
  activeEvents: 23,
}

const categoryLabels = {
  reforestation: "Reforestación",
  cleanup: "Limpieza",
  education: "Educación",
  conservation: "Conservación",
  pollution: "Contaminación",
  deforestation: "Deforestación",
  wildlife: "Vida Silvestre",
  waste: "Residuos",
  ngo: "ONG",
  government: "Gubernamental",
  private: "Privada",
  community: "Comunitaria",
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // State for each section
  const [users, setUsers] = useState<DashboardUser[]>(mockUsers)
  const [events, setEvents] = useState<DashboardEvent[]>(mockEvents)
  const [posts, setPosts] = useState<DashboardPost[]>(mockPosts)
  const [organizations, setOrganizations] = useState<DashboardOrganization[]>(mockOrganizations)
  const [reports, setReports] = useState<DashboardReport[]>(mockReports)

  // Search states
  const [userSearch, setUserSearch] = useState("")
  const [eventSearch, setEventSearch] = useState("")
  const [postSearch, setPostSearch] = useState("")
  const [orgSearch, setOrgSearch] = useState("")
  const [reportSearch, setReportSearch] = useState("")

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)

  // Edit states
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null)
  const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null)
  const [editingOrg, setEditingOrg] = useState<DashboardOrganization | null>(null)

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    maxParticipants: "",
    category: "" as DashboardEvent["category"] | "",
  })

  const [orgForm, setOrgForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    category: "" as DashboardOrganization["category"] | "",
    founded: "",
  })

  // Filter functions
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  )

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.organizationName.toLowerCase().includes(eventSearch.toLowerCase()),
  )

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.authorName.toLowerCase().includes(postSearch.toLowerCase()),
  )

  const filteredOrgs = organizations.filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase()))

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.address.toLowerCase().includes(reportSearch.toLowerCase()),
  )

  // CRUD Functions for Users
  const handleCreateUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    const newUser: DashboardUser = {
      id: Date.now().toString(),
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      roles: ["ROLE_ORGANIZATION"],
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers((prev) => [...prev, newUser])
    setUserForm({ name: "", email: "", phone: "", password: "" })
    setIsUserDialogOpen(false)

    toast({
      title: "Usuario creado",
      description: "El usuario de organización ha sido creado exitosamente.",
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema.",
    })
  }

  // CRUD Functions for Events
  const handleCreateEvent = () => {
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date || !eventForm.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    const newEvent: DashboardEvent = {
      id: Date.now().toString(),
      name: eventForm.name,
      description: eventForm.description,
      date: eventForm.date,
      location: eventForm.location,
      organizationId: user?.organizationId || "1",
      organizationName: user?.name || "Organización",
      participants: 0,
      maxParticipants: eventForm.maxParticipants ? Number.parseInt(eventForm.maxParticipants) : undefined,
      category: eventForm.category as DashboardEvent["category"],
      finished: false,
    }

    setEvents((prev) => [newEvent, ...prev])
    setEventForm({ name: "", description: "", date: "", location: "", maxParticipants: "", category: "" })
    setIsEventDialogOpen(false)

    toast({
      title: "Evento creado",
      description: "El evento ha sido creado exitosamente.",
    })
  }

  const handleEditEvent = () => {
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date || !eventForm.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent!.id
          ? {
              ...event,
              name: eventForm.name,
              description: eventForm.description,
              date: eventForm.date,
              location: eventForm.location,
              maxParticipants: eventForm.maxParticipants ? Number.parseInt(eventForm.maxParticipants) : undefined,
              category: eventForm.category as DashboardEvent["category"],
            }
          : event,
      ),
    )

    setEditingEvent(null)
    setEventForm({ name: "", description: "", date: "", location: "", maxParticipants: "", category: "" })

    toast({
      title: "Evento actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    toast({
      title: "Evento eliminado",
      description: "El evento ha sido eliminado del sistema.",
    })
  }

  const openEditEventDialog = (event: DashboardEvent) => {
    setEditingEvent(event)
    setEventForm({
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      maxParticipants: event.maxParticipants?.toString() || "",
      category: event.category,
    })
  }

  // CRUD Functions for Posts
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    toast({
      title: "Publicación eliminada",
      description: "La publicación ha sido eliminada del sistema.",
    })
  }

  // CRUD Functions for Organizations
  const handleCreateOrganization = () => {
    if (
      !orgForm.name.trim() ||
      !orgForm.description.trim() ||
      !orgForm.email.trim() ||
      !orgForm.category ||
      !orgForm.founded
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    const newOrg: DashboardOrganization = {
      id: Date.now().toString(),
      name: orgForm.name,
      description: orgForm.description,
      email: orgForm.email,
      phone: orgForm.phone,
      address: orgForm.address,
      category: orgForm.category as DashboardOrganization["category"],
      members: 0,
      eventsCount: 0,
      founded: orgForm.founded,
    }

    setOrganizations((prev) => [...prev, newOrg])
    setOrgForm({ name: "", description: "", email: "", phone: "", address: "", category: "", founded: "" })
    setIsOrgDialogOpen(false)

    toast({
      title: "Organización creada",
      description: "La organización ha sido creada exitosamente.",
    })
  }

  const handleEditOrganization = () => {
    if (
      !orgForm.name.trim() ||
      !orgForm.description.trim() ||
      !orgForm.email.trim() ||
      !orgForm.category ||
      !orgForm.founded
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === editingOrg!.id
          ? {
              ...org,
              name: orgForm.name,
              description: orgForm.description,
              email: orgForm.email,
              phone: orgForm.phone,
              address: orgForm.address,
              category: orgForm.category as DashboardOrganization["category"],
              founded: orgForm.founded,
            }
          : org,
      ),
    )

    setEditingOrg(null)
    setOrgForm({ name: "", description: "", email: "", phone: "", address: "", category: "", founded: "" })

    toast({
      title: "Organización actualizada",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

  const handleDeleteOrganization = (orgId: string) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== orgId))
    toast({
      title: "Organización eliminada",
      description: "La organización ha sido eliminada del sistema.",
    })
  }

  const openEditOrgDialog = (org: DashboardOrganization) => {
    setEditingOrg(org)
    setOrgForm({
      name: org.name,
      description: org.description,
      email: org.email,
      phone: org.phone || "",
      address: org.address || "",
      category: org.category,
      founded: org.founded,
    })
  }

  // CRUD Functions for Reports
  const handleToggleReportStatus = (reportId: string) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, done: !r.done } : r)))

    const report = reports.find((r) => r.id === reportId)
    toast({
      title: report?.done ? "Reporte reabierto" : "Reporte completado",
      description: report?.done
        ? "El reporte ha sido marcado como pendiente."
        : "El reporte ha sido marcado como completado.",
    })
  }

  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId))
    toast({
      title: "Reporte eliminado",
      description: "El reporte ha sido eliminado del sistema.",
    })
  }

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
              {hasRole("ROLE_ADMIN") && <TabsTrigger value="users">Usuarios</TabsTrigger>}
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="posts">Publicaciones</TabsTrigger>
              {hasRole("ROLE_ADMIN") && <TabsTrigger value="organizations">Organizaciones</TabsTrigger>}
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">Usuarios registrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.filter((e) => !e.finished).length}</div>
                    <p className="text-xs text-muted-foreground">{events.length} eventos totales</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Publicaciones</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{posts.length}</div>
                    <p className="text-xs text-muted-foreground">Publicaciones totales</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organizaciones</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{organizations.length}</div>
                    <p className="text-xs text-muted-foreground">Organizaciones activas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reportes Pendientes</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{reports.filter((r) => !r.done).length}</div>
                    <p className="text-xs text-muted-foreground">{reports.length} reportes totales</p>
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
            </TabsContent>

            {/* Users Tab */}
            {hasRole("ROLE_ADMIN") && (
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Gestión de Usuarios</CardTitle>
                        <CardDescription>Administra usuarios de la plataforma</CardDescription>
                      </div>
                      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Usuario Organización
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Crear Usuario de Organización</DialogTitle>
                            <DialogDescription>Crea una cuenta de usuario con rol de organización</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nombre</Label>
                              <Input
                                value={userForm.name}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Nombre de la organización"
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="email@organization.com"
                              />
                            </div>
                            <div>
                              <Label>Teléfono (opcional)</Label>
                              <Input
                                value={userForm.phone}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="+51 123 456 789"
                              />
                            </div>
                            <div>
                              <Label>Contraseña</Label>
                              <Input
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="Contraseña inicial"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleCreateUser}>Crear Usuario</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-3">
                      {filteredUsers.map((user) => (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{user.name}</h4>
                                  {user.roles.map((role) => (
                                    <Badge key={role} variant="secondary">
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                  </div>
                                  {user.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {user.phone}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Registrado: {new Date(user.createdAt).toLocaleDateString("es-ES")}
                                  </div>
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al
                                      usuario.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gestión de Eventos</CardTitle>
                      <CardDescription>Administra eventos ambientales</CardDescription>
                    </div>
                    {hasRole("ROLE_ORGANIZATION") && (
                      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Evento
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
                            <DialogDescription>
                              {editingEvent ? "Actualiza la información del evento" : "Crea un nuevo evento ambiental"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nombre del evento</Label>
                              <Input
                                value={eventForm.name}
                                onChange={(e) => setEventForm((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Nombre del evento"
                              />
                            </div>
                            <div>
                              <Label>Descripción</Label>
                              <Textarea
                                value={eventForm.description}
                                onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe el evento..."
                                rows={4}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Fecha</Label>
                                <Input
                                  type="date"
                                  value={eventForm.date}
                                  onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Categoría</Label>
                                <Select
                                  value={eventForm.category}
                                  onValueChange={(value) =>
                                    setEventForm((prev) => ({ ...prev, category: value as DashboardEvent["category"] }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona categoría" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="reforestation">Reforestación</SelectItem>
                                    <SelectItem value="cleanup">Limpieza</SelectItem>
                                    <SelectItem value="education">Educación</SelectItem>
                                    <SelectItem value="conservation">Conservación</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Ubicación</Label>
                              <Input
                                value={eventForm.location}
                                onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="Dirección del evento"
                              />
                            </div>
                            <div>
                              <Label>Máximo de participantes (opcional)</Label>
                              <Input
                                type="number"
                                value={eventForm.maxParticipants}
                                onChange={(e) => setEventForm((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                                placeholder="Ej: 50"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEventDialogOpen(false)
                                setEditingEvent(null)
                                setEventForm({
                                  name: "",
                                  description: "",
                                  date: "",
                                  location: "",
                                  maxParticipants: "",
                                  category: "",
                                })
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={editingEvent ? handleEditEvent : handleCreateEvent}>
                              {editingEvent ? "Guardar Cambios" : "Crear Evento"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar eventos..."
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{event.name}</h4>
                                <Badge>{categoryLabels[event.category]}</Badge>
                                {event.finished && <Badge variant="secondary">Finalizado</Badge>}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString("es-ES")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {event.participants} participantes
                                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  {event.organizationName}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {hasRole("ROLE_ORGANIZATION") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    openEditEventDialog(event)
                                    setIsEventDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará el evento y todas sus participaciones.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteEvent(event.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Publicaciones</CardTitle>
                  <CardDescription>Modera y administra publicaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar publicaciones..."
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredPosts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{post.title}</h4>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {post.authorName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(post.postDate).toLocaleDateString("es-ES")}
                                </div>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organizations Tab */}
            {hasRole("ROLE_ADMIN") && (
              <TabsContent value="organizations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Gestión de Organizaciones</CardTitle>
                        <CardDescription>Administra organizaciones registradas</CardDescription>
                      </div>
                      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Organización
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{editingOrg ? "Editar Organización" : "Crear Nueva Organización"}</DialogTitle>
                            <DialogDescription>
                              {editingOrg
                                ? "Actualiza la información de la organización"
                                : "Registra una nueva organización"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nombre</Label>
                              <Input
                                value={orgForm.name}
                                onChange={(e) => setOrgForm((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Nombre de la organización"
                              />
                            </div>
                            <div>
                              <Label>Descripción</Label>
                              <Textarea
                                value={orgForm.description}
                                onChange={(e) => setOrgForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe la organización..."
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={orgForm.email}
                                  onChange={(e) => setOrgForm((prev) => ({ ...prev, email: e.target.value }))}
                                  placeholder=" contacto@org.com"
                                />
                              </div>
                              <div>
                                <Label>Teléfono</Label>
                                <Input
                                  value={orgForm.phone}
                                  onChange={(e) => setOrgForm((prev) => ({ ...prev, phone: e.target.value }))}
                                  placeholder="+51 123 456 789"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Dirección</Label>
                              <Input
                                value={orgForm.address}
                                onChange={(e) => setOrgForm((prev) => ({ ...prev, address: e.target.value }))}
                                placeholder="Dirección completa"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Categoría</Label>
                                <Select
                                  value={orgForm.category}
                                  onValueChange={(value) =>
                                    setOrgForm((prev) => ({
                                      ...prev,
                                      category: value as DashboardOrganization["category"],
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona categoría" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ngo">ONG</SelectItem>
                                    <SelectItem value="government">Gubernamental</SelectItem>
                                    <SelectItem value="private">Privada</SelectItem>
                                    <SelectItem value="community">Comunitaria</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Fecha de fundación</Label>
                                <Input
                                  type="date"
                                  value={orgForm.founded}
                                  onChange={(e) => setOrgForm((prev) => ({ ...prev, founded: e.target.value }))}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsOrgDialogOpen(false)
                                setEditingOrg(null)
                                setOrgForm({
                                  name: "",
                                  description: "",
                                  email: "",
                                  phone: "",
                                  address: "",
                                  category: "",
                                  founded: "",
                                })
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={editingOrg ? handleEditOrganization : handleCreateOrganization}>
                              {editingOrg ? "Guardar Cambios" : "Crear Organización"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar organizaciones..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-3">
                      {filteredOrgs.map((org) => (
                        <Card key={org.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{org.name}</h4>
                                  <Badge>{categoryLabels[org.category]}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{org.description}</p>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {org.email}
                                  </div>
                                  {org.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {org.phone}
                                    </div>
                                  )}
                                  {org.address && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {org.address}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {org.members} miembros · {org.eventsCount} eventos
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    openEditOrgDialog(org)
                                    setIsOrgDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar organización?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción eliminará la organización y todos sus eventos asociados.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteOrganization(org.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Reportes</CardTitle>
                  <CardDescription>Revisa y gestiona reportes ambientales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar reportes..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredReports.map((report) => (
                      <Card key={report.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{report.title}</h4>
                                <Badge>{categoryLabels[report.category]}</Badge>
                                <Badge
                                  variant={
                                    report.severity === "high"
                                      ? "destructive"
                                      : report.severity === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {report.severity === "high"
                                    ? "Alta"
                                    : report.severity === "medium"
                                      ? "Media"
                                      : "Baja"}
                                </Badge>
                                {report.done ? (
                                  <Badge className="bg-green-100 text-green-800">Completado</Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {report.authorName}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(report.date).toLocaleDateString("es-ES")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {report.address}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {hasRole("ROLE_ADMIN") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleReportStatus(report.id)}
                                  className={
                                    report.done
                                      ? "text-yellow-600 hover:text-yellow-700"
                                      : "text-green-600 hover:text-green-700"
                                  }
                                >
                                  {report.done ? (
                                    <AlertTriangle className="h-4 w-4" />
                                  ) : (
                                    <Activity className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              {hasRole("ROLE_ADMIN") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar reporte?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El reporte será eliminado permanentemente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteReport(report.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
