"use client"

import type { UserType, PaginatedUsersResponse } from "@/features/user/types"
import {Event as EventType} from "@/features/event/types"
import { useAddRoleToUser, useRemoveRoleFromUser, useGetRoles } from "@/features/role/queries"
import { useGetUsers } from "@/features/user/queries"
import { useCreateReport, useGetReports, useDeleteReport, usePatchReport, useUpdateReport } from "@/features/report/queries"
import { useCreateEvent, useGetEvents, useDeleteEvent, useUpdateEvent } from "@/features/event/queries"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import dynamic from "next/dynamic"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, UserCog, Shield as ShieldIcon } from "lucide-react"


// Interfaces
interface DashboardUser {
  id: string
  name: string
  email: string
  phone?: string
  roles: UserRole[]
  organizationId?: string
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
  latitude?: number
  longitude?: number
}

// Importación dinámica del mapa
const MapLocationPicker = dynamic(
  () => import("@/components/map/MapLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-500 mt-2 text-sm">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
) as any;

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
  const [activeTab, setActiveTab] = useState("users")

  const [users, setUsers] = useState<DashboardUser[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null)
  // State for each section
  const [events, setEvents] = useState<DashboardEvent[]>(mockEvents)
  const [posts, setPosts] = useState<DashboardPost[]>(mockPosts)
  const [organizations, setOrganizations] = useState<DashboardOrganization[]>(mockOrganizations)
  const [reports, setReports] = useState<DashboardReport[]>(mockReports)


  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    isError,
    isSuccess
  } = useGetUsers({ page, size })

  const {
    data: reportsData,
    isLoading: isLoadingReports,
    error: reportsError,
    refetch: refetchReports
  } = useGetReports()

  const{
    data: eventsData,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents
  } = useGetEvents()


  // Get available roles
const { data: availableRoles = [], isLoading: isLoadingRoles } = useGetRoles();
  const { mutate: addRole, isPending: isAddingRole } = useAddRoleToUser()
  const { mutate: removeRole, isPending: isRemovingRole } = useRemoveRoleFromUser()
  const { mutate: createReport, isPending: isCreatingReport } = useCreateReport()
  const { mutate: deleteReport, isPending: isDeletingReport } = useDeleteReport()
  const { mutate: patchReport, isPending: isPatchingReport } = usePatchReport()
  const { mutate: updateReport, isPending: isUpdatingReport } = useUpdateReport()

  //Event mutations
  const { mutate: createEvent, isPending: isCreatingEvent} = useCreateEvent()
  const { mutate: deleteEvent, isPending: isDeletingEvent} = useDeleteEvent()
  const { mutate: updateEvent, isPending: isUpdatingEvent} = useUpdateEvent()



  // Listar Usuarios desde la API
  useEffect(() => {
    if (usersData?.payload && Array.isArray(usersData.payload)) {
      const mappedUsers: DashboardUser[] = usersData.payload.map((user: UserType) => {
        const roleNames = user.roles.map(role => role.name);

        const validRoles = roleNames.filter((role): role is UserRole =>
          role === "ROLE_ADMIN" || role === "ROLE_USER" || role === "ROLE_ORGANIZATION"
        );

        return {
          id: user.id.toString(),
          name: `${user.name} ${user.surname}`.trim(),
          email: user.email || '',
          phone: user.phone || '',
          roles: validRoles.length > 0 ? validRoles : ["ROLE_USER"],
          createdAt: new Date().toISOString()
        };
      });

      setUsers(mappedUsers)
    }
  }, [usersData])

  // Listar Reportes desde la API
  useEffect(() => {
    if (reportsData?.content && Array.isArray(reportsData.content)) {
      const mappedReports: DashboardReport[] = reportsData.content.map((report: any) => {

        const address = report.location
          ? `Lat: ${report.location.latitude.toFixed(4)}, Lng: ${report.location.longitude.toFixed(4)}`
          : "Sin ubicación";

        return {
          id: report.id.toString(),
          title: report.title,
          description: report.description,
          date: report.date,
          address: address,
          authorId: report.author,
          authorName: report.author,
          done: report.done,
          latitude: report.location?.latitude,
          longitude: report.location?.longitude,
          // Como el backend no devuelve category y severity, usamos valores por defecto
          category: "pollution" as const,
          severity: "medium" as const,
        };
      });

      setReports(mappedReports)
    }
  }, [reportsData])

  //Listar Events desde la API
  useEffect(() => {
  if (eventsData?.payload && Array.isArray(eventsData.payload)) {
    const mappedEvents: DashboardEvent[] = eventsData.payload.map((event: EventType) => ({
      id: event.id.toString(),
      name: event.name,
      description: event.description,
      date: event.date || new Date().toISOString(),
      location: event.direction || '',
      organizationId: event.idOrganization?.toString() || "",
      organizationName: "Organización", 
      participants: 0,
      category: "reforestation", 
      finished: event.finished || false
    }));

    setEvents(mappedEvents);
  }
}, [eventsData]);

  // Manejo de errores
  useEffect(() => {
    if (usersError) {
      console.error('Error loading users:', usersError)
      toast({
        title: "Error",
        description: `No se pudieron cargar los usuarios: ${usersError.message}`,
        variant: "destructive",
      })
    }
  }, [usersError, toast])

  useEffect(() => {
    if (reportsError) {
      console.error('Error loading reports:', reportsError)
      toast({
        title: "Error",
        description: `No se pudieron cargar los reportes: ${reportsError.message}`,
        variant: "destructive",
      })
    }
  }, [reportsError, toast])

  // Handle role change
  const handleAddRole = (roleName: string) => {
    if (!selectedUser) return;

    // Check if user already has this role
    if (selectedUser.roles.includes(roleName as UserRole)) {
      toast({
        title: "Información",
        description: "El usuario ya tiene este rol.",
        variant: "default",
      })
      return;
    }

    addRole(
      { userId: Number(selectedUser.id), roleName },
      {
        onSuccess: () => {
          toast({
            title: "Rol agregado",
            description: `El rol ${roleName} ha sido agregado al usuario.`,
          })
          setRoleDialogOpen(false)
          setSelectedUser(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "No se pudo agregar el rol",
            variant: "destructive",
          })
          console.error('Error adding role:', error)
        },
      }
    )
  }

  const handleRemoveRole = (roleName: string) => {
    if (!selectedUser) return;

    // Prevent removing last role
    if (selectedUser.roles.length === 1) {
      toast({
        title: "Error",
        description: "Un usuario debe tener al menos un rol.",
        variant: "destructive",
      })
      return;
    }

    removeRole(
      { userId: Number(selectedUser.id), roleName },
      {
        onSuccess: () => {
          toast({
            title: "Rol removido",
            description: `El rol ${roleName} ha sido removido del usuario.`,
          })
          setRoleDialogOpen(false)
          setSelectedUser(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "No se pudo remover el rol",
            variant: "destructive",
          })
          console.error('Error removing role:', error)
        },
      }
    )
  }
  const openRoleDialog = (user: DashboardUser) => {
    setSelectedUser(user)
    setRoleDialogOpen(true)
  }


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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  // Edit states
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null)
  const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null)
  const [editingOrg, setEditingOrg] = useState<DashboardOrganization | null>(null)
  const [editingReport, setEditingReport] = useState<DashboardReport | null>(null)

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

  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    location: null as { lat: number; lng: number } | null,
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
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    createEvent(
      {
        name: eventForm.name,
        description: eventForm.description,
        direction: eventForm.location,
        date: eventForm.date,
        latitude: 0, // Agregar si es necesario
        longitude: 0, // Agregar si es necesario
        idOrganization: user?.organizationId ? Number(user.organizationId) : undefined
      },
      {
        onSuccess: () => {
          toast({
            title: "Evento creado",
            description: "El evento ha sido creado exitosamente."
          });
          setEventForm({ name: "", description: "", date: "", location: "", maxParticipants: "", category: "" });
          setIsEventDialogOpen(false);
          refetchEvents();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `No se pudo crear el evento: ${error.message || "Error desconocido"}`,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleEditEvent = () => {
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date || !editingEvent) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    updateEvent(
      {
        idEvent: Number(editingEvent.id),
        event: {
          name: eventForm.name,
          description: eventForm.description,
          direction: eventForm.location,
          date: eventForm.date,
          idOrganization: user?.organizationId ? Number(user.organizationId) : undefined
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Evento actualizado",
            description: "Los cambios han sido guardados exitosamente."
          });
          setEventForm({ name: "", description: "", date: "", location: "", maxParticipants: "", category: "" });
          setEditingEvent(null);
          setIsEventDialogOpen(false);
          refetchEvents();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar el evento: ${error.message || "Error desconocido"}`,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(Number(eventId), {
      onSuccess: () => {
        toast({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado del sistema."
        });
        refetchEvents();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `No se pudo eliminar el evento: ${error.message || "Error desconocido"}`,
          variant: "destructive"
        });
      }
    });
  };

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
  const handleCreateReport = () => {
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos y selecciona una ubicación en el mapa.",
        variant: "destructive",
      })
      return
    }

    createReport(
      {
        title: reportForm.title,
        description: reportForm.description,
        latitude: reportForm.location.lat,
        longitude: reportForm.location.lng,
      },
      {
        onSuccess: () => {
          toast({
            title: "Reporte creado",
            description: "El reporte ha sido creado exitosamente.",
          })
          setReportForm({ title: "", description: "", location: null })
          setIsReportDialogOpen(false)
          refetchReports()
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `No se pudo crear el reporte: ${error.message || "Error desconocido"}`,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleToggleReportStatus = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    const newStatus = !report.done

    patchReport(
      { id: Number(reportId), data: { done: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: newStatus ? "Reporte completado" : "Reporte reabierto",
            description: newStatus
              ? "El reporte ha sido marcado como completado."
              : "El reporte ha sido marcado como pendiente.",
          })
          refetchReports()
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar el estado del reporte: ${error.message || "Error desconocido"}`,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleDeleteReport = (reportId: string) => {
    deleteReport(Number(reportId), {
      onSuccess: () => {
        toast({
          title: "Reporte eliminado",
          description: "El reporte ha sido eliminado del sistema.",
        })
        refetchReports()
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `No se pudo eliminar el reporte: ${error.message || "Error desconocido"}`,
          variant: "destructive",
        })
      },
    })
  }

  const openEditReportDialog = (report: DashboardReport) => {
    setEditingReport(report)
    setReportForm({
      title: report.title,
      description: report.description,
      location: report.latitude && report.longitude
        ? { lat: report.latitude, lng: report.longitude }
        : null,
    })
    setIsReportDialogOpen(true)
  }

  const handleEditReport = () => {
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location || !editingReport) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos y selecciona una ubicación en el mapa.",
        variant: "destructive",
      })
      return
    }

    updateReport(
      {
        id: Number(editingReport.id),
        report: {
          title: reportForm.title,
          description: reportForm.description,
          latitude: reportForm.location.lat,
          longitude: reportForm.location.lng,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Reporte actualizado",
            description: "El reporte ha sido actualizado exitosamente.",
          })
          setReportForm({ title: "", description: "", location: null })
          setEditingReport(null)
          setIsReportDialogOpen(false)
          refetchReports()
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar el reporte: ${error.message || "Error desconocido"}`,
            variant: "destructive",
          })
        },
      }
    )
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Panel de control para gestión de la plataforma</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {hasRole("ROLE_ADMIN") && (
                <TabsTrigger value="users" className="text-sm sm:text-base">
                  Usuarios
                </TabsTrigger>
              )}
              <TabsTrigger value="events" className="text-sm sm:text-base">
                Eventos
              </TabsTrigger>
              <TabsTrigger value="posts" className="text-sm sm:text-base">
                Publicaciones
              </TabsTrigger>
              {hasRole("ROLE_ADMIN") && (
                <TabsTrigger value="organizations" className="text-sm sm:text-base">
                  Organizaciones
                </TabsTrigger>
              )}
              <TabsTrigger value="reports" className="text-sm sm:text-base">
                Reportes
              </TabsTrigger>
            </TabsList>


            {/* Users Tab */}
            {hasRole("ROLE_ADMIN") && (
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">Gestión de Usuarios</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                          Administra usuarios de la plataforma
                        </CardDescription>
                        {usersData && (
                          <p className="text-sm text-gray-500 mt-1">
                            Total: {usersData.totalElements} usuarios
                          </p>
                        )}
                      </div>
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

                    {/* Loading state */}
                    {isLoadingUsers && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-500">Cargando usuarios...</p>
                      </div>
                    )}

                    {/* Error state */}
                    {isError && (
                      <div className="text-center py-8 bg-red-50 rounded-lg">
                        <p className="text-red-500">Error al cargar usuarios</p>
                      </div>
                    )}

                    {/* Users list */}
                    {isSuccess && users.length > 0 && (
                      <>
                        <div className="space-y-3">
                          {filteredUsers.map((user) => (
                            <Card key={user.id}>
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
                                  <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-sm sm:text-base">{user.name}</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {user.roles.map((role) => (
                                          <Badge key={role} variant="secondary" className="text-xs sm:text-sm">
                                            {role}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                                      <div className="flex items-center gap-2 break-all">
                                        <Mail className="h-4 w-4 flex-shrink-0" />
                                        {user.email}
                                      </div>
                                      {user.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 flex-shrink-0" />
                                          {user.phone}
                                        </div>
                                      )}

                                    </div>
                                  </div>

                                  {/* Actions Menu */}
                                  <div className="flex gap-2">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                          <UserCog className="h-4 w-4 mr-2" />
                                          Gestionar Roles
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Paginación */}
                        {usersData && usersData.totalPages > 1 && (
                          <div className="flex justify-between items-center mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setPage((p) => Math.max(0, p - 1))}
                              disabled={page === 0}
                            >
                              Anterior
                            </Button>
                            <span className="text-sm text-gray-600">
                              Página {page + 1} de {usersData.totalPages}
                            </span>
                            <Button
                              variant="outline"
                              onClick={() => setPage((p) => p + 1)}
                              disabled={page >= usersData.totalPages - 1}
                            >
                              Siguiente
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Gestión de Eventos</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Administra eventos ambientales</CardDescription>
                    </div>
                    {hasRole("ROLE_ORGANIZATION") && (
                      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full sm:w-auto">
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
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
                            <div className="flex-1 w-full">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm sm:text-base">{event.name}</h4>
                                <div className="flex flex-wrap gap-1">
                                  <Badge className="text-xs sm:text-sm">{categoryLabels[event.category]}</Badge>
                                  {event.finished && <Badge variant="secondary" className="text-xs sm:text-sm">Finalizado</Badge>}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-none">{event.description}</p>
                              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  {new Date(event.date).toLocaleDateString("es-ES")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span className="line-clamp-1">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 flex-shrink-0" />
                                  {event.participants} participantes
                                  {event.maxParticipants && ` / ${event.maxParticipants}`}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 flex-shrink-0" />
                                  <span className="line-clamp-1">{event.organizationName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {hasRole("ROLE_ORGANIZATION") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    //openEditEventDialog(event)
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Gestión de Reportes</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Revisa y gestiona reportes ambientales</CardDescription>
                    </div>
                    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Reporte
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingReport ? "Editar Reporte" : "Crear Nuevo Reporte"}</DialogTitle>
                          <DialogDescription>
                            {editingReport
                              ? "Actualiza la información del reporte ambiental."
                              : "Crea un reporte ambiental. Selecciona la ubicación en el mapa."}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Título del reporte</Label>
                            <Input
                              value={reportForm.title}
                              onChange={(e) => setReportForm((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="Ej: Contaminación en río"
                            />
                          </div>
                          <div>
                            <Label>Descripción</Label>
                            <Textarea
                              value={reportForm.description}
                              onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe el problema ambiental..."
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Ubicación *</Label>
                            <MapLocationPicker
                              selectedLocation={reportForm.location}
                              onLocationSelect={(location: { lat: number; lng: number } | null) =>
                                setReportForm((prev) => ({ ...prev, location }))
                              }
                              height="350px"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsReportDialogOpen(false)
                              setReportForm({ title: "", description: "", location: null })
                              setEditingReport(null)
                            }}
                            disabled={isCreatingReport || isUpdatingReport}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={editingReport ? handleEditReport : handleCreateReport}
                            disabled={isCreatingReport || isUpdatingReport}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {editingReport
                              ? isUpdatingReport
                                ? "Actualizando..."
                                : "Guardar Cambios"
                              : isCreatingReport
                              ? "Creando..."
                              : "Crear Reporte"}
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
                      placeholder="Buscar reportes..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {isLoadingReports && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p className="text-gray-500">Cargando reportes...</p>
                    </div>
                  )}

                  {reportsError && !isLoadingReports && (
                    <div className="text-center py-8 bg-red-50 rounded-lg">
                      <p className="text-red-500">Error al cargar reportes</p>
                    </div>
                  )}

                  {/* Reports list */}
                  {!isLoadingReports && !reportsError && (
                    <div className="space-y-3">
                      {filteredReports.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No hay reportes disponibles</p>
                        </div>
                      ) : (
                        filteredReports.map((report) => (
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
                                  onClick={() => openEditReportDialog(report)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {hasRole("ROLE_ADMIN") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={
                                        report.done
                                          ? "text-yellow-600 hover:text-yellow-700"
                                          : "text-green-600 hover:text-green-700"
                                      }
                                      disabled={isPatchingReport}
                                    >
                                      {report.done ? (
                                        <AlertTriangle className="h-4 w-4" />
                                      ) : (
                                        <Activity className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {report.done ? "¿Reabrir reporte?" : "¿Marcar como completado?"}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {report.done
                                          ? "El reporte será marcado como pendiente nuevamente."
                                          : "El reporte será marcado como completado y resuelto."}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleToggleReportStatus(report.id)}
                                        className={
                                          report.done
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                        }
                                      >
                                        {report.done ? "Reabrir" : "Marcar como completado"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              {hasRole("ROLE_ADMIN") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      disabled={isDeletingReport}
                                    >
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
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Role Management Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Gestionar Roles de Usuario
              </DialogTitle>
              <DialogDescription>
                Usuario: <strong>{selectedUser?.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Roles */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Roles Actuales</Label>
                <div className="space-y-2">
                  {selectedUser?.roles.map((role) => (
                    <div
                      key={role}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{role}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(role)}
                        disabled={isRemovingRole || selectedUser.roles.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Roles to Add */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Agregar Rol</Label>
                {isLoadingRoles ? (
                  <p className="text-sm text-gray-500">Cargando roles disponibles...</p>
                ) : (
                  <div className="space-y-2">
                    {availableRoles
                      ?.filter((role) => !selectedUser?.roles.includes(role.name as UserRole))
                      .map((role) => (
                        <Button
                          key={role.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleAddRole(role.name)}
                          disabled={isAddingRole}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {role.name}
                        </Button>
                      ))}
                    {availableRoles?.every((role) =>
                      selectedUser?.roles.includes(role.name as UserRole)
                    ) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          El usuario ya tiene todos los roles disponibles
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRoleDialogOpen(false)
                  setSelectedUser(null)
                }}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </ProtectedRoute >
  )
}
