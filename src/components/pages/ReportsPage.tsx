"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, MapPin, CheckCircle, AlertTriangle } from "lucide-react"
import { useGetReports } from "@/features/report/queries"


export default function ReportsPage() {
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")

  // Fetch reports from API
  const { data: reportsResponse, isLoading, error } = useGetReports()
  const reports = reportsResponse?.content || []

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.author && report.author.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !report.done) ||
      (statusFilter === "completed" && report.done)

    return matchesSearch && matchesStatus
  })


  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes Ambientales</h1>
            <p className="text-gray-600 mt-2">Reportes de problemas ambientales de la comunidad</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4" />
            {isLoading ? "Cargando..." : `${filteredReports.length} reporte${filteredReports.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Cargando reportes...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar reportes</h3>
                <p className="text-red-700">No se pudieron cargar los reportes. Por favor, intenta de nuevo más tarde.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Grid */}
        {!isLoading && !error && (
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
                          {report.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {report.author}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.date).toLocaleDateString("es-ES")}
                          </div>
                          {(report.latitude && report.longitude) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">{report.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
