"use client";

import type { UserType, PaginatedUsersResponse } from "@/features/user/types";
import Image from "next/image";
import {
  useAddRoleToUser,
  useRemoveRoleFromUser,
  useGetRoles,
} from "@/features/role/queries";
import { useGetUsers, useGetUsersForCombobox } from "@/features/user/queries";
import {
  useCreateReport,
  useGetReports,
  useDeleteReport,
  usePatchReport,
  useUpdateReport,
} from "@/features/report/queries";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event as EventType } from "@/features/event/types"
import { useCreateEvent, useGetEvents, useDeleteEvent, useUpdateEvent, useCountParticipants } from "@/features/event/queries"
import { eventApi } from "@/features/event/api"

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  UserCog,
  Shield as ShieldIcon,
  Loader2,
} from "lucide-react";
import {
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useGetOrganizations,
} from "@/features/organization/queries";
import ImageUploader from "@/components/upload/ImageUploader";

/* IMPORTAR COMPONENTES SEGMENTADOS */
import UserSection from "@/components/pages/dashboard/UserSection";
import EventSection from "@/components/pages/dashboard/EventSection";
import PostSection from "@/components/pages/dashboard/PostSection";
import OrganizationSection from "@/components/pages/dashboard/OrganizationSection";
import ReportSection from "@/components/pages/dashboard/ReportSection";

/* Tipos locales — mantén consistencia con tu archivo original */
interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  organizationId?: string;
  createdAt?: string;
}

interface DashboardEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  organizationId: string;
  organizationName: string;
  participants: number;
  maxParticipants?: number;
  category: "reforestation" | "cleanup" | "education" | "conservation";
  finished: boolean;
}

interface DashboardPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  postDate: string;
}

interface DashboardOrganization {
  id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  category: "ngo" | "government" | "private" | "community";
  members: number;
  eventsCount: number;
  founded: string;
}

interface DashboardReport {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  authorId: string;
  authorName: string;
  done: boolean;
  category: "pollution" | "deforestation" | "wildlife" | "waste";
  severity: "low" | "medium" | "high";
  latitude?: number;
  longitude?: number;
}


/* Map dynamic (igual que en tu archivo original) */
const MapLocationPicker = dynamic(() => import("@/components/map/MapLocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="text-gray-500 mt-2 text-sm">Cargando mapa...</p>
      </div>
    </div>
  ),
}) as any;

/* mocks (si los usas) */
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
];

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
];

const categoryLabels: Record<string, string> = {
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
};

export default function DashboardPage() {


const hasRole = (role: string | UserRole): boolean => {
  if (!user?.roles) return false;
  return user.roles.includes(role as UserRole);
};

  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  // State for each section
  const [events, setEvents] = useState<DashboardEvent[]>(mockEvents);
  const [posts, setPosts] = useState<DashboardPost[]>(mockPosts);
  const [organizations, setOrganizations] = useState<DashboardOrganization[]>([]);
  const [reports, setReports] = useState<DashboardReport[]>([]);
  const [participantsCounts, setParticipantsCounts] = useState<Record<number, number>>({}); // Almacenar conteo por evento

  const createOrgMutation = useCreateOrganization();
  const updateOrgMutation = useUpdateOrganization();
  const deleteOrgMutation = useDeleteOrganization();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    isError,
    isSuccess,
  } = useGetUsers({ page, size });

  const {
    data: orgsData,
    isLoading: isLoadingOrgs,
    error: orgsError,
  } = useGetOrganizations({ page: 0, size: 10 });

  useEffect(() => {
    if (orgsData?.payload && Array.isArray(orgsData.payload)) {
      const mappedOrgs: DashboardOrganization[] = orgsData.payload.map(
        (org: any) => ({
          id: org.id.toString(),
          name: org.name,
          description: org.description,
          email: org.contactEmail,
          phone: org.contactPhone || "",
          address: org.address || "",
          logo: org.logo || "",
          category: org.category || "ngo",
          members: org.members || 0,
          eventsCount: org.eventsCount || 0,
          founded: org.created_at || new Date().toISOString(),
        })
      );
      setOrganizations(mappedOrgs);
    }
  }, [orgsData]);

  useEffect(() => {
    if (orgsError) {
      console.error("Error loading organizations:", orgsError);
      toast({
        title: "Error",
        description: `No se pudieron cargar las organizaciones: ${orgsError.message}`,
        variant: "destructive",
      });
    }
  }, [orgsError, toast]);

  const {
    data: usersForCombobox,
    isLoading: isLoadingComboboxUsers,
    error: comboboxUsersError,
  } = useGetUsersForCombobox();

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



  // Listar Usuarios desde la API -> mapeo y setUsers
  useEffect(() => {
    if (usersData?.payload && Array.isArray(usersData.payload)) {
      const mappedUsers: DashboardUser[] = usersData.payload.map((u: UserType) => {
        const roleNames = u.roles.map((role) => role.name);
        const validRoles = roleNames.filter(
          (role): role is UserRole =>
            role === "ROLE_ADMIN" || role === "ROLE_USER" || role === "ROLE_ORGANIZATION"
        );

        return {
          id: u.id.toString(),
          name: `${u.name} ${u.surname}`.trim(),
          email: u.email || "",
          phone: u.phone || "",
          roles: validRoles.length > 0 ? validRoles : ["ROLE_USER"],
          createdAt: new Date().toISOString(),
        };
      });

      setUsers(mappedUsers);
    }
  }, [usersData]);

  // Mapear reportes desde API
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
          address,
          authorId: report.author,
          authorName: report.author,
          done: report.done,
          latitude: report.location?.latitude,
          longitude: report.location?.longitude,
          category: "pollution" as const,
          severity: "medium" as const,
        };
      });

      setReports(mappedReports);
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

  // Cargar conteo de participantes para cada evento
  useEffect(() => {
    const loadParticipantsCounts = async () => {
      const counts: Record<number, number> = {};
      
      for (const event of events) {
        const eventId = Number(event.id);
        try {
          const count = await eventApi.countParticipants(eventId);
          const n = Number(count);
          counts[eventId] = Number.isNaN(n) ? 0 : n;
        } catch (err) {
          console.error(`Error loading participant count for event ${eventId}:`, err);
          counts[eventId] = 0;
        }
      }
      
      setParticipantsCounts(counts);
    };

    if (events.length > 0) {
      loadParticipantsCounts();
    }
  }, [events]);

  // Manejo de errores usuarios y reportes
  useEffect(() => {
    if (usersError) {
      console.error("Error loading users:", usersError);
      toast({
        title: "Error",
        description: `No se pudieron cargar los usuarios: ${usersError.message}`,
        variant: "destructive",
      });
    }
  }, [usersError, toast]);

  useEffect(() => {
    if (reportsError) {
      console.error("Error loading reports:", reportsError);
      toast({
        title: "Error",
        description: `No se pudieron cargar los reportes: ${reportsError.message}`,
        variant: "destructive",
      });
    }
  }, [reportsError, toast]);

  // Handle role change
  const handleAddRole = (roleName: string) => {
    if (!selectedUser) return;

    if (selectedUser.roles.includes(roleName as UserRole)) {
      toast({ title: "Información", description: "El usuario ya tiene este rol.", variant: "default" });
      return;
    }

    addRole(
      { userId: Number(selectedUser.id), roleName },
      {
        onSuccess: () => {
          toast({ title: "Rol agregado", description: `El rol ${roleName} ha sido agregado al usuario.` });
          setRoleDialogOpen(false);
          setSelectedUser(null);
        },
        onError: (error) => {
          toast({ title: "Error", description: "No se pudo agregar el rol", variant: "destructive" });
          console.error("Error adding role:", error);
        },
      }
    );
  };

  const handleRemoveRole = (roleName: string) => {
    if (!selectedUser) return;
    if (selectedUser.roles.length === 1) {
      toast({ title: "Error", description: "Un usuario debe tener al menos un rol.", variant: "destructive" });
      return;
    }

    removeRole(
      { userId: Number(selectedUser.id), roleName },
      {
        onSuccess: () => {
          toast({ title: "Rol removido", description: `El rol ${roleName} ha sido removido del usuario.` });
          setRoleDialogOpen(false);
          setSelectedUser(null);
        },
        onError: (error) => {
          toast({ title: "Error", description: "No se pudo remover el rol", variant: "destructive" });
          console.error("Error removing role:", error);
        },
      }
    );
  };

  const openRoleDialog = (user: DashboardUser) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  // Search states
  const [userSearch, setUserSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [orgSearch, setOrgSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Edit states
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
  const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null);
  const [editingOrg, setEditingOrg] = useState<DashboardOrganization | null>(null);
  const [editingReport, setEditingReport] = useState<DashboardReport | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [eventForm, setEventForm] = useState({ name: "", description: "", date: "", location: null as { lat: number; lng: number } | string | null, maxParticipants: "", category: "" as DashboardEvent["category"] | "", idOrganization: "" });
  const [orgForm, setOrgForm] = useState({ name: "", description: "", contactEmail: "", contactPhone: "", creatorId: null as number | null, logo: "", editing: false });
  const [reportForm, setReportForm] = useState({ title: "", description: "", location: null as { lat: number; lng: number } | null, editing: false });

  const handleImageSelected = (imageUrl: string) => {
    setOrgForm((prev) => ({ ...prev, logo: imageUrl }));
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredEvents = events.filter((e) => e.name.toLowerCase().includes(eventSearch.toLowerCase()) || e.organizationName.toLowerCase().includes(eventSearch.toLowerCase()));
  const filteredPosts = posts.filter((p) => p.title.toLowerCase().includes(postSearch.toLowerCase()) || p.authorName.toLowerCase().includes(postSearch.toLowerCase()));
  const filteredOrgs = organizations.filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase()));
  const filteredReports = reports.filter((r) => r.title.toLowerCase().includes(reportSearch.toLowerCase()) || r.address.toLowerCase().includes(reportSearch.toLowerCase()));

  // CRUD Users
  const handleCreateUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
      toast({ title: "Error", description: "Por favor completa todos los campos obligatorios.", variant: "destructive" });
      return;
    }
    const newUser: DashboardUser = { id: Date.now().toString(), name: userForm.name, email: userForm.email, phone: userForm.phone, roles: ["ROLE_ORGANIZATION"] };
    setUsers((prev) => [...prev, newUser]);
    setUserForm({ name: "", email: "", phone: "", password: "" });
    setIsUserDialogOpen(false);
    toast({ title: "Usuario creado", description: "El usuario de organización ha sido creado exitosamente." });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast({ title: "Usuario eliminado", description: "El usuario ha sido eliminado del sistema." });
  };

  // CRUD Events
  const handleCreateEvent = () => {
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    const loc = eventForm.location as { lat: number; lng: number } | string | null;
    const payloadCreate: Omit<EventType, "id"> = {
      name: eventForm.name,
      description: eventForm.description,
      direction: typeof loc === "string" ? loc : loc ? `${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}` : "",
      date: eventForm.date,
      idOrganization: eventForm.idOrganization ? Number(eventForm.idOrganization) : undefined,
      finished: false,
      latitude: typeof loc === "object" && loc ? loc.lat : undefined,
      longitude: typeof loc === "object" && loc ? loc.lng : undefined,
    };

    createEvent(
      payloadCreate,
      {
        onSuccess: () => {
          toast({ title: "Evento creado", description: "El evento ha sido creado exitosamente." });
          setEventForm({ name: "", description: "", date: "", location: null, maxParticipants: "", category: "", idOrganization: "" });
          setIsEventDialogOpen(false);
          try { refetchEvents?.(); } catch (e) { /* ignore */ }
        },
        onError: (error: any) => {
          toast({ title: "Error", description: `No se pudo crear el evento: ${error?.message || "Error desconocido"}`, variant: "destructive" });
          console.error("createEvent error:", error);
        },
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

    const locUp = eventForm.location as { lat: number; lng: number } | string | null;
    const payloadUpdate: { idEvent: number; event: Omit<EventType, "id"> } = {
      idEvent: Number(editingEvent.id),
      event: {
        name: eventForm.name,
        description: eventForm.description,
        direction: typeof locUp === "string" ? locUp : locUp ? `${locUp.lat.toFixed(6)},${locUp.lng.toFixed(6)}` : "",
        date: eventForm.date,
        idOrganization: eventForm.idOrganization ? Number(eventForm.idOrganization) : undefined,
        finished: editingEvent.finished,
        latitude: typeof locUp === "object" && locUp ? locUp.lat : undefined,
        longitude: typeof locUp === "object" && locUp ? locUp.lng : undefined,
      },
    };

    updateEvent(payloadUpdate,
      {
        onSuccess: () => {
          toast({ title: "Evento actualizado", description: "Los cambios han sido guardados exitosamente." });
          setEditingEvent(null);
          setEventForm({ name: "", description: "", date: "", location: null, maxParticipants: "", category: "", idOrganization: "" });
          try { refetchEvents?.(); } catch (e) { /* ignore */ }
        },
        onError: (error: any) => {
          toast({ title: "Error", description: `No se pudo actualizar el evento: ${error?.message || "Error desconocido"}`, variant: "destructive" });
          console.error("updateEvent error:", error);
        },
      }
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(Number(eventId), {
      onSuccess: () => {
        toast({ title: "Evento eliminado", description: "El evento ha sido eliminado del sistema." });
        try { refetchEvents?.(); } catch (e) { /* ignore */ }
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `No se pudo eliminar el evento: ${error?.message || "Error desconocido"}`, variant: "destructive" });
        console.error("deleteEvent error:", error);
      },
    });
  };

  const openEditEventDialog = (event: DashboardEvent) => {
    setEditingEvent(event);
    setEventForm({ name: event.name, description: event.description, date: event.date, location: null, maxParticipants: event.maxParticipants?.toString() || "", category: event.category, idOrganization: event.organizationId });
  };

  // Posts
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast({ title: "Publicación eliminada", description: "La publicación ha sido eliminada del sistema." });
  };

  // Organizations CRUD 
  const handleCreateOrganization = () => {
    if (!orgForm.name.trim() || !orgForm.description.trim() || !orgForm.contactEmail.trim() || !orgForm.contactPhone.trim() || !orgForm.creatorId) {
      toast({ title: "Error", description: "Por favor completa todos los campos obligatorios.", variant: "destructive" });
      return;
    }

    createOrgMutation.mutate(
      {
        name: orgForm.name,
        description: orgForm.description,
        contactEmail: orgForm.contactEmail,
        contactPhone: orgForm.contactPhone,
        creatorId: orgForm.creatorId,
        logo: orgForm.logo || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Organización creada con éxito!", description: "La organización ha sido creada." });
          setOrgForm({ name: "", description: "", contactEmail: "", contactPhone: "", creatorId: null, logo: "", editing: false });
          setIsOrgDialogOpen(false);
        },
        onError: (error: Error) => {
          toast({ title: "Error al crear", description: error.message || "No se pudo conectar al servidor.", variant: "destructive" });
        },
      }
    );
  };

  const handleEditOrganization = () => {
    if (!editingOrg || !orgForm.name.trim() || !orgForm.description.trim() || !orgForm.contactEmail.trim() || !orgForm.contactPhone.trim() || !orgForm.creatorId) {
      toast({ title: "Error", description: "Por favor completa todos los campos obligatorios.", variant: "destructive" });
      return;
    }

    updateOrgMutation.mutate(
      {
        id: Number(editingOrg.id),
        org: {
          name: orgForm.name,
          description: orgForm.description,
          contactEmail: orgForm.contactEmail,
          contactPhone: orgForm.contactPhone,
          creatorId: orgForm.creatorId,
          logo: orgForm.logo || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Organización actualizada", description: "Los cambios han sido guardados exitosamente." });
          setEditingOrg(null);
          setOrgForm({ name: "", description: "", contactEmail: "", contactPhone: "", creatorId: null, logo: "", editing: false });
          setIsOrgDialogOpen(false);
        },
        onError: (error: Error) => {
          toast({ title: "Error al actualizar", description: error.message || "No se pudo conectar al servidor.", variant: "destructive" });
        },
      }
    );
  };

  const handleDeleteOrganization = (orgId: string) => {
    deleteOrgMutation.mutate(Number(orgId), {
      onSuccess: () => {
        toast({ title: "Organización eliminada", description: "La organización ha sido eliminada del sistema." });
      },
      onError: (error: Error) => {
        toast({ title: "Error al eliminar", description: error.message || "No se pudo conectar al servidor.", variant: "destructive" });
      },
    });
  };

  const openEditOrgDialog = (org: DashboardOrganization) => {
    setEditingOrg(org);
    setOrgForm({ name: org.name, description: org.description, contactEmail: org.email, contactPhone: org.phone || "", creatorId: null, logo: org.logo || "", editing: true });
    setIsOrgDialogOpen(true);
  };

  // Reports CRUD
  const handleCreateReport = () => {
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location) {
      toast({ title: "Error", description: "Por favor completa todos los campos y selecciona una ubicación en el mapa.", variant: "destructive" });
      return;
    }

    createReport({ title: reportForm.title, description: reportForm.description, latitude: reportForm.location.lat, longitude: reportForm.location.lng }, {
      onSuccess: () => {
        toast({ title: "Reporte creado", description: "El reporte ha sido creado exitosamente." });
        setReportForm({ title: "", description: "", location: null, editing: false });
        setIsReportDialogOpen(false);
        refetchReports();
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `No se pudo crear el reporte: ${error.message || "Error desconocido"}`, variant: "destructive" });
      },
    });
  };

  const handleToggleReportStatus = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    const newStatus = !report.done;

    patchReport({ id: Number(reportId), data: { done: newStatus } }, {
      onSuccess: () => {
        toast({ title: newStatus ? "Reporte completado" : "Reporte reabierto", description: newStatus ? "El reporte ha sido marcado como completado." : "El reporte ha sido marcado como pendiente." });
        refetchReports();
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `No se pudo actualizar el estado del reporte: ${error.message || "Error desconocido"}`, variant: "destructive" });
      },
    });
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(Number(reportId), {
      onSuccess: () => {
        toast({ title: "Reporte eliminado", description: "El reporte ha sido eliminado del sistema." });
        refetchReports();
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `No se pudo eliminar el reporte: ${error.message || "Error desconocido"}`, variant: "destructive" });
      },
    });
  };

  const openEditReportDialog = (report: DashboardReport) => {
    setEditingReport(report);
    setReportForm({ title: report.title, description: report.description, location: report.latitude && report.longitude ? { lat: report.latitude, lng: report.longitude } : null, editing: true });
    setIsReportDialogOpen(true);
  };

  const handleEditReport = () => {
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location || !editingReport) {
      toast({ title: "Error", description: "Por favor completa todos los campos y selecciona una ubicación en el mapa.", variant: "destructive" });
      return;
    }

    updateReport({
      id: Number(editingReport.id),
      report: { title: reportForm.title, description: reportForm.description, latitude: reportForm.location.lat, longitude: reportForm.location.lng },
    }, {
      onSuccess: () => {
        toast({ title: "Reporte actualizado", description: "El reporte ha sido actualizado exitosamente." });
        setReportForm({ title: "", description: "", location: null, editing: false });
        setEditingReport(null);
        setIsReportDialogOpen(false);
        refetchReports();
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `No se pudo actualizar el reporte: ${error.message || "Error desconocido"}`, variant: "destructive" });
      },
    });
  };

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
    );
  }

  return (
    <ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_ORGANIZATION"]}>
      <Layout>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Panel de control para gestión de la plataforma</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 h-auto p-1">
              {hasRole("ROLE_ADMIN") && (
                <TabsTrigger value="users" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">Usuarios</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="events" className="text-xs sm:text-sm px-2 py-2">Eventos</TabsTrigger>
              <TabsTrigger value="posts" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Publicaciones</span>
                <span className="sm:hidden">Posts</span>
              </TabsTrigger>
              {hasRole("ROLE_ADMIN") && (
                <TabsTrigger value="organizations" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden lg:inline">Organizaciones</span>
                  <span className="lg:hidden">Orgs</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="reports" className="text-xs sm:text-sm px-2 py-2">Reportes</TabsTrigger>
            </TabsList>

            {hasRole("ROLE_ADMIN") && (
              <TabsContent value="users" className="space-y-4 sm:space-y-6">
                <UserSection
                  users={filteredUsers}
                  userSearch={userSearch}
                  setUserSearch={setUserSearch}
                  isLoading={isLoadingUsers}
                  isError={isError}
                  usersData={usersData}
                  page={page}
                  setPage={setPage}
                  openRoleDialog={openRoleDialog}
                />
              </TabsContent>
            )}

            <TabsContent value="events" className="space-y-4 sm:space-y-6">
              <EventSection
                events={events}
                eventSearch={eventSearch}
                setEventSearch={setEventSearch}
                filteredEvents={filteredEvents}
                openEditEventDialog={openEditEventDialog}
                setIsEventDialogOpen={setIsEventDialogOpen}
                handleDeleteEvent={handleDeleteEvent}
                isEventDialogOpen={isEventDialogOpen}
                eventForm={eventForm}
                setEventForm={setEventForm}
                handleCreateEvent={handleCreateEvent}
                handleEditEvent={handleEditEvent}
                isCreatingEvent={isCreatingEvent}
                isUpdatingEvent={isUpdatingEvent}
                isDeletingEvent={isDeletingEvent}
                editingEvent={editingEvent}
                organizations={organizations}
                hasRole={hasRole}
                categoryLabels={categoryLabels}
                participantsCounts={participantsCounts}
              />
            </TabsContent>

            <TabsContent value="posts" className="space-y-4 sm:space-y-6">
              <PostSection filteredPosts={filteredPosts} postSearch={postSearch} setPostSearch={setPostSearch} handleDeletePost={handleDeletePost} />
            </TabsContent>

            {hasRole("ROLE_ADMIN") && (
              <TabsContent value="organizations" className="space-y-4 sm:space-y-6">
                <OrganizationSection
                  organizations={organizations}
                  orgSearch={orgSearch}
                  setOrgSearch={setOrgSearch}
                  filteredOrgs={filteredOrgs}
                  isOrgDialogOpen={isOrgDialogOpen}
                  setIsOrgDialogOpen={setIsOrgDialogOpen}
                  orgForm={orgForm}
                  setOrgForm={setOrgForm}
                  usersForCombobox={usersForCombobox}
                  isLoadingComboboxUsers={isLoadingComboboxUsers}
                  createOrgMutation={createOrgMutation}
                  updateOrgMutation={updateOrgMutation}
                  deleteOrgMutation={deleteOrgMutation}
                  handleImageSelected={handleImageSelected}
                  handleCreateOrganization={handleCreateOrganization}
                  handleEditOrganization={handleEditOrganization}
                  handleDeleteOrganization={handleDeleteOrganization}
                  openEditOrgDialog={openEditOrgDialog}
                  categoryLabels={categoryLabels}
                />
              </TabsContent>
            )}

            <TabsContent value="reports" className="space-y-4 sm:space-y-6">
              <ReportSection
                reports={reports}
                reportSearch={reportSearch}
                setReportSearch={setReportSearch}
                filteredReports={filteredReports}
                isReportDialogOpen={isReportDialogOpen}
                setIsReportDialogOpen={setIsReportDialogOpen}
                reportForm={reportForm}
                setReportForm={setReportForm}
                handleCreateReport={handleCreateReport}
                handleEditReport={handleEditReport}
                openEditReportDialog={openEditReportDialog}
                handleToggleReportStatus={handleToggleReportStatus}
                handleDeleteReport={handleDeleteReport}
                isLoadingReports={isLoadingReports}
                reportsError={reportsError}
                isCreatingReport={isCreatingReport}
                isUpdatingReport={isUpdatingReport}
                isPatchingReport={isPatchingReport}
                isDeletingReport={isDeletingReport}
                categoryLabels={categoryLabels}
                hasRole={hasRole}
                refetchReports={refetchReports}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Role Management Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShieldIcon className="h-4 w-4 sm:h-5 sm:w-5" /> Gestionar Roles de Usuario
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Usuario: <strong>{selectedUser?.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-2 block">Roles Actuales</Label>
                <div className="space-y-2">
                  {selectedUser?.roles.map((role) => (
                    <div key={role} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{role}</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveRole(role)} 
                        disabled={isRemovingRole || selectedUser.roles.length === 1} 
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium mb-2 block">Agregar Rol</Label>
                {isLoadingRoles ? (
                  <p className="text-xs sm:text-sm text-gray-500">Cargando roles disponibles...</p>
                ) : (
                  <div className="space-y-2">
                    {availableRoles
                      ?.filter((role) => !selectedUser?.roles.includes(role.name as UserRole))
                      .map((role) => (
                        <Button 
                          key={role.id} 
                          variant="outline" 
                          className="w-full justify-start text-xs sm:text-sm" 
                          onClick={() => handleAddRole(role.name)} 
                          disabled={isAddingRole}
                        >
                          {role.name}
                        </Button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}