"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, User, AlertTriangle, CheckCircle, Droplets, TreePine, Trash2, Bird } from "lucide-react"

interface MapReport {
  id: string
  title: string
  category: "pollution" | "deforestation" | "wildlife" | "waste"
  lat: number
  lng: number
  address: string
  date: string
  description: string
  authorName: string
  done: boolean
  severity: "low" | "medium" | "high"
}

// Mock reports data for map
const mockMapReports: MapReport[] = [
  {
    id: "1",
    title: "Contaminación Río Rímac",
    category: "pollution",
    lat: -12.03,
    lng: -77.08,
    address: "Río Rímac, Sector Industrial",
    date: "2024-01-20",
    description: "Vertido de residuos industriales detectado",
    authorName: "Admin Usuario",
    done: false,
    severity: "high",
  },
  {
    id: "2",
    title: "Deforestación Ilegal",
    category: "deforestation",
    lat: -12.2,
    lng: -77.1,
    address: "Zona Protegida Norte",
    date: "2024-01-25",
    description: "Tala ilegal en zona protegida",
    authorName: "Admin Usuario",
    done: false,
    severity: "high",
  },
  {
    id: "3",
    title: "Acumulación de Residuos",
    category: "waste",
    lat: -12.1167,
    lng: -77.0167,
    address: "Playa Costa Verde",
    date: "2024-01-18",
    description: "Residuos plásticos en la playa",
    authorName: "Admin Usuario",
    done: true,
    severity: "medium",
  },
  {
    id: "4",
    title: "Fauna en Peligro",
    category: "wildlife",
    lat: -12.15,
    lng: -77.12,
    address: "Reserva Natural Pantanos",
    date: "2024-01-22",
    description: "Aves migratorias afectadas por contaminación",
    authorName: "Admin Usuario",
    done: false,
    severity: "medium",
  },
]

const categoryIcons = {
  pollution: Droplets,
  deforestation: TreePine,
  wildlife: Bird,
  waste: Trash2,
}

const categoryColors = {
  pollution: "bg-red-100 text-red-800",
  deforestation: "bg-orange-100 text-orange-800",
  wildlife: "bg-purple-100 text-purple-800",
  waste: "bg-yellow-100 text-yellow-800",
}

const categoryLabels = {
  pollution: "Contaminación",
  deforestation: "Deforestación",
  wildlife: "Vida Silvestre",
  waste: "Residuos",
}

const severityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const severityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

export default function MapReportsPage() {
  const { isAuthenticated } = useAuth()
  const [reports] = useState<MapReport[]>(mockMapReports)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null)

  const filteredReports = reports.filter((report) => {
    const matchesCategory = selectedCategory === "all" || report.category === selectedCategory
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "pending" && !report.done) ||
      (selectedStatus === "completed" && report.done)
    const matchesSeverity = selectedSeverity === "all" || report.severity === selectedSeverity
    return matchesCategory && matchesStatus && matchesSeverity
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Reportes</h1>
          <p className="text-gray-600 mt-2">Visualiza reportes ambientales geolocalizados</p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-orange-700 mb-3">
                  <strong>¿Detectaste un problema ambiental?</strong> Los reportes ayudan a documentar y resolver
                  problemas.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white bg-transparent"
                  >
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/auth/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa de Reportes Ambientales</CardTitle>
                <CardDescription>Ubicaciones de problemas ambientales reportados</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-[500px] bg-orange-50 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-200">
                  <div className="text-center">
                    <AlertTriangle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-600 text-lg font-medium">Mapa de Reportes</p>
                    <p className="text-orange-500 text-sm mt-2">Integración con Leaflet/Google Maps</p>
                    <p className="text-orange-500 text-sm">Mostrando {filteredReports.length} reportes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="pollution">Contaminación</SelectItem>
                      <SelectItem value="deforestation">Deforestación</SelectItem>
                      <SelectItem value="wildlife">Vida Silvestre</SelectItem>
                      <SelectItem value="waste">Residuos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="completed">Completados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severidad</label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>Reportes ({filteredReports.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredReports.map((report) => {
                  const IconComponent = categoryIcons[report.category]
                  return (
                    <div
                      key={report.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedReport?.id === report.id ? "border-orange-500 bg-orange-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{report.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{report.address}</p>
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            <Badge className={`text-xs ${categoryColors[report.category]}`}>
                              {categoryLabels[report.category]}
                            </Badge>
                            <Badge className={`text-xs ${severityColors[report.severity]}`}>
                              {severityLabels[report.severity]}
                            </Badge>
                            {report.done ? (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                <CheckCircle className="h-2 w-2 mr-1" />
                                Resuelto
                              </Badge>
                            ) : (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="h-2 w-2 mr-1" />
                                Pendiente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredReports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay reportes que coincidan con los filtros</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Report Details */}
            {selectedReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedReport.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={categoryColors[selectedReport.category]}>
                      {categoryLabels[selectedReport.category]}
                    </Badge>
                    <Badge className={severityColors[selectedReport.severity]}>
                      Severidad {severityLabels[selectedReport.severity]}
                    </Badge>
                    {selectedReport.done ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resuelto
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedReport.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedReport.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedReport.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Reportado por {selectedReport.authorName}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" asChild>
                    <Link href="/reports">Ver Todos los Reportes</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
