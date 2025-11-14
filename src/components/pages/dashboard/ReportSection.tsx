"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, User, Activity, AlertTriangle, Trash2, Edit, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";

const MapLocationPicker = dynamic(() => import("@/components/map/MapLocationPicker"), { ssr: false }) as any;

export default function ReportSection({
  reports,
  reportSearch,
  setReportSearch,
  filteredReports,
  isReportDialogOpen,
  setIsReportDialogOpen,
  reportForm,
  setReportForm,
  handleCreateReport,
  handleEditReport,
  openEditReportDialog,
  handleToggleReportStatus,
  handleDeleteReport,
  isLoadingReports,
  reportsError,
  isCreatingReport,
  isUpdatingReport,
  isPatchingReport,
  isDeletingReport,
  categoryLabels,
  hasRole,
  refetchReports,
}: {
  reports: any[];
  reportSearch: string;
  setReportSearch: (v: string) => void;
  filteredReports: any[];
  isReportDialogOpen: boolean;
  setIsReportDialogOpen: (b: boolean) => void;
  reportForm: any;
  setReportForm: (f: any) => void;
  handleCreateReport: () => void;
  handleEditReport: () => void;
  openEditReportDialog: (r: any) => void;
  handleToggleReportStatus: (id: string) => void;
  handleDeleteReport: (id: string) => void;
  isLoadingReports: boolean;
  reportsError: any;
  isCreatingReport: boolean;
  isUpdatingReport: boolean;
  isPatchingReport: boolean;
  isDeletingReport: boolean;
  categoryLabels: Record<string, string>;
  hasRole: (role: string) => boolean;
  refetchReports: () => void;
}) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Gestión de Reportes</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base mt-1">Revisa y gestiona reportes ambientales</CardDescription>
          </div>

          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> Crear Reporte
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">{reportForm.editing ? "Editar Reporte" : "Crear Nuevo Reporte"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">{reportForm.editing ? "Actualiza el reporte" : "Crea un reporte ambiental. Selecciona ubicación en mapa."}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-xs sm:text-sm">Título del reporte</Label>
                  <Input value={reportForm.title} onChange={(e) => setReportForm((prev: any) => ({ ...prev, title: e.target.value }))} placeholder="Ej: Contaminación en río" className="text-xs sm:text-sm" />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Descripción</Label>
                  <Textarea value={reportForm.description} onChange={(e) => setReportForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe el problema ambiental..." rows={3} className="text-xs sm:text-sm resize-none" />
                </div>

                <div>
                  <Label className="mb-2 block text-xs sm:text-sm">Ubicación *</Label>
                  <MapLocationPicker selectedLocation={reportForm.location} onLocationSelect={(location: { lat: number; lng: number } | null) => setReportForm((prev: any) => ({ ...prev, location }))} height="250px" />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                <Button variant="outline" onClick={() => { setIsReportDialogOpen(false); setReportForm({ title: "", description: "", location: null }); }} disabled={isCreatingReport || isUpdatingReport} className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</Button>
                <Button onClick={reportForm.editing ? handleEditReport : handleCreateReport} disabled={isCreatingReport || isUpdatingReport} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                  {reportForm.editing ? (isUpdatingReport ? "Actualizando..." : "Guardar Cambios") : (isCreatingReport ? "Creando..." : "Crear Reporte")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input placeholder="Buscar reportes..." value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} className="pl-8 sm:pl-10 text-xs sm:text-sm" />
        </div>

        {isLoadingReports && (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-500 text-xs sm:text-sm">Cargando reportes...</p>
          </div>
        )}

        {reportsError && !isLoadingReports && (
          <div className="text-center py-6 sm:py-8 bg-red-50 rounded-lg">
            <p className="text-red-500 text-xs sm:text-sm">Error al cargar reportes</p>
          </div>
        )}

        {!isLoadingReports && !reportsError && (
          <div className="space-y-2 sm:space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No hay reportes disponibles</div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-2">
                          <h4 className="font-semibold text-sm sm:text-base break-words flex-1 min-w-0">{report.title}</h4>
                          <Badge className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0">{categoryLabels[report.category]}</Badge>
                          
                          {report.done ? (
                            <Badge className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0">Completado</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0">Pendiente</Badge>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{report.description}</p>

                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{report.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{new Date(report.date).toLocaleDateString("es-ES")}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{report.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t sm:border-t-0 sm:pt-0">
                        {hasRole("ROLE_ADMIN") && (
                          <Button variant="ghost" size="sm" onClick={() => openEditReportDialog(report)} className="text-gray-600 hover:text-gray-900 h-8 w-8 sm:h-9 sm:w-9 p-0">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}

                        {hasRole("ROLE_ADMIN") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className={`${report.done ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"} h-8 w-8 sm:h-9 sm:w-9 p-0`} disabled={isPatchingReport}>
                                {report.done ? <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> : <Activity className="h-3 w-3 sm:h-4 sm:w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base sm:text-lg">{report.done ? "¿Reabrir reporte?" : "¿Marcar como completado?"}</AlertDialogTitle>
                                <AlertDialogDescription className="text-xs sm:text-sm">{report.done ? "El reporte será marcado como pendiente nuevamente." : "El reporte será marcado como completado y resuelto."}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleToggleReportStatus(report.id)} className={`w-full sm:w-auto ${report.done ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-xs sm:text-sm`}>
                                  {report.done ? "Reabrir" : "Marcar como completado"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {hasRole("ROLE_ADMIN") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0" disabled={isDeletingReport}>
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base sm:text-lg">¿Eliminar reporte?</AlertDialogTitle>
                                <AlertDialogDescription className="text-xs sm:text-sm">Esta acción no se puede deshacer. El reporte será eliminado permanentemente.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReport(report.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-xs sm:text-sm">Eliminar</AlertDialogAction>
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
  );
}
