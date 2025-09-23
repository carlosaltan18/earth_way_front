"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Calendar, User, MapPin, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Report {
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
  images?: string[]
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: "1",
    title: "Contaminación Río Rímac",
    description:
      "Vertido de residuos industriales detectado en el sector norte del río. Se observan cambios en el color del agua y presencia de espuma tóxica.",
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
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "2",
    title: "Deforestación Ilegal Detectada",
    description: "Tala ilegal en zona protegida con maquinaria pesada. Aproximadamente 2 hectáreas afectadas.",
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
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "3",
    title: "Acumulación de Residuos Plásticos",
    description: "Gran cantidad de residuos plásticos acumulados en la playa, afectando la fauna marina local.",
    date: "2024-01-18",
    location: {
      lat: -12.1167,
      lng: -77.0167,
      address: "Playa Costa Verde",
    },
    authorId: "1",
    authorName: "Admin Usuario",
    done: true,
    category: "waste",
    images: ["/placeholder.svg?height=300&width=500"],
  },
]

const categoryLabels = {
  pollution: "Contaminación",
  deforestation: "Deforestación",
  wildlife: "Vida Silvestre",
  waste: "Residuos",
}

const categoryColors = {
  pollution: "bg-red-100 text-red-800",
  deforestation: "bg-orange-100 text-orange-800",
  wildlife: "bg-purple-100 text-purple-800",
  waste: "bg-yellow-100 text-yellow-800",
}

export default function ReportsPage() {
  const { user, hasRole, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    category: "" as Report["category"] | "",
  })

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !report.done) ||
      (statusFilter === "completed" && report.done)

    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleCreateReport = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    const newReport: Report = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      location: {
        lat: -12.0464, // Mock coordinates
        lng: -77.0428,
        address: formData.address,
      },
      authorId: user!.id,
      authorName: user!.name,
      done: false,
      category: formData.category as Report["category"],
    }

    setReports((prev) => [newReport, ...prev])
    setFormData({ title: "", description: "", address: "", category: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "¡Reporte creado!",
      description: "Tu reporte ha sido creado exitosamente.",
    })
  }

  const handleEditReport = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    setReports((prev) =>
      prev.map((report) =>
        report.id === editingReport!.id
          ? {
              ...report,
              title: formData.title,
              description: formData.description,
              location: { ...report.location, address: formData.address },
              category: formData.category as Report["category"],
            }
          : report,
      ),
    )

    setEditingReport(null)
    setFormData({ title: "", description: "", address: "", category: "" })

    toast({
      title: "¡Reporte actualizado!",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

  const handleToggleStatus = (reportId: string) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, done: !report.done } : report)))

    const report = reports.find((r) => r.id === reportId)
    toast({
      title: report?.done ? "Reporte reabierto" : "Reporte finalizado",
      description: report?.done
        ? "El reporte ha sido marcado como pendiente."
        : "El reporte ha sido marcado como completado.",
    })
  }

  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== reportId))
    toast({
      title: "Reporte eliminado",
      description: "El reporte ha sido eliminado exitosamente.",
    })
  }

  const openEditDialog = (report: Report) => {
    setEditingReport(report)
    setFormData({
      title: report.title,
      description: report.description,
      address: report.location.address,
      category: report.category,
    })
  }

  const canEditReport = (report: Report) => {
    return hasRole("ROLE_ADMIN") || (isAuthenticated && user?.id === report.authorId)
  }

  const canCreateReport = () => {
    return hasRole("ROLE_ADMIN")
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes Ambientales</h1>
            <p className="text-gray-600 mt-2">Reportes de problemas ambientales de la comunidad</p>
          </div>

          {canCreateReport() && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Reporte
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Reporte</DialogTitle>
                  <DialogDescription>
                    Reporta un problema ambiental para que la comunidad pueda actuar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Título del reporte"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value as Report["category"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pollution">Contaminación</SelectItem>
                        <SelectItem value="deforestation">Deforestación</SelectItem>
                        <SelectItem value="wildlife">Vida Silvestre</SelectItem>
                        <SelectItem value="waste">Residuos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ubicación</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Dirección o ubicación del problema"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descripción</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe detalladamente el problema ambiental..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateReport}>Crear Reporte</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los reportes</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="pollution">Contaminación</SelectItem>
              <SelectItem value="deforestation">Deforestación</SelectItem>
              <SelectItem value="wildlife">Vida Silvestre</SelectItem>
              <SelectItem value="waste">Residuos</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4" />
            {filteredReports.length} reporte{filteredReports.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Call to action for non-authenticated users */}
        {!isAuthenticated && (
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">¿Detectaste un problema ambiental?</h3>
                <p className="text-orange-700 mb-4">
                  Los administradores pueden crear reportes para documentar y resolver problemas ambientales.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white bg-transparent"
                  >
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/auth/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? "No se encontraron reportes que coincidan con tu búsqueda." : "No hay reportes aún."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className={`hover:shadow-md transition-shadow ${report.done ? "opacity-75" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{report.title}</CardTitle>
                        <Badge className={categoryColors[report.category]}>{categoryLabels[report.category]}</Badge>
                        {report.done ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {report.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString("es-ES")}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {report.location.address}
                        </div>
                      </div>
                    </div>

                    {canEditReport(report) && (
                      <div className="flex gap-2">
                        {hasRole("ROLE_ADMIN") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(report.id)}
                            className={
                              report.done
                                ? "text-yellow-600 hover:text-yellow-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {report.done ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(report)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {report.images && report.images.length > 0 && (
                  <div className="px-6">
                    <img
                      src={report.images[0] || "/placeholder.svg"}
                      alt={report.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </div>
                )}
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed">{report.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingReport} onOpenChange={() => setEditingReport(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Reporte</DialogTitle>
              <DialogDescription>Actualiza la información del reporte</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del reporte"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as Report["category"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pollution">Contaminación</SelectItem>
                    <SelectItem value="deforestation">Deforestación</SelectItem>
                    <SelectItem value="wildlife">Vida Silvestre</SelectItem>
                    <SelectItem value="waste">Residuos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Dirección o ubicación del problema"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe detalladamente el problema ambiental..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingReport(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditReport}>Guardar Cambios</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
