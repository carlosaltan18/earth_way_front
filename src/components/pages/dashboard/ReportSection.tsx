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
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Gestión de Reportes</CardTitle>
            <CardDescription className="text-sm sm:text-base">Revisa y gestiona reportes ambientales</CardDescription>
          </div>

          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Crear Reporte</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{reportForm.editing ? "Editar Reporte" : "Crear Nuevo Reporte"}</DialogTitle>
                <DialogDescription>{reportForm.editing ? "Actualiza el reporte" : "Crea un reporte ambiental. Selecciona ubicación en mapa."}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Título del reporte</Label>
                  <Input value={reportForm.title} onChange={(e) => setReportForm((prev: any) => ({ ...prev, title: e.target.value }))} placeholder="Ej: Contaminación en río" />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea value={reportForm.description} onChange={(e) => setReportForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe el problema ambiental..." rows={4} />
                </div>

                <div>
                  <Label className="mb-2 block">Ubicación *</Label>
                  <MapLocationPicker selectedLocation={reportForm.location} onLocationSelect={(location: { lat: number; lng: number } | null) => setReportForm((prev: any) => ({ ...prev, location }))} height="350px" />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsReportDialogOpen(false); setReportForm({ title: "", description: "", location: null }); }} disabled={isCreatingReport || isUpdatingReport}>Cancelar</Button>
                <Button onClick={reportForm.editing ? handleEditReport : handleCreateReport} disabled={isCreatingReport || isUpdatingReport} className="bg-blue-600 hover:bg-blue-700">
                  {reportForm.editing ? (isUpdatingReport ? "Actualizando..." : "Guardar Cambios") : (isCreatingReport ? "Creando..." : "Crear Reporte")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar reportes..." value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} className="pl-10" />
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

        {!isLoadingReports && !reportsError && (
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay reportes disponibles</div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge>{categoryLabels[report.category]}</Badge>
                          
                          {report.done ? <Badge className="bg-green-100 text-green-800">Completado</Badge> : <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2"><User className="h-4 w-4" />{report.authorName}</div>
                          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(report.date).toLocaleDateString("es-ES")}</div>
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{report.address}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {hasRole("ROLE_ADMIN") && (
                          <Button variant="ghost" size="sm" onClick={() => openEditReportDialog(report)} className="text-gray-600 hover:text-gray-900"><Edit className="h-4 w-4" /></Button>
                        )}

                        {hasRole("ROLE_ADMIN") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className={report.done ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"} disabled={isPatchingReport}>
                                {report.done ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{report.done ? "¿Reabrir reporte?" : "¿Marcar como completado?"}</AlertDialogTitle>
                                <AlertDialogDescription>{report.done ? "El reporte será marcado como pendiente nuevamente." : "El reporte será marcado como completado y resuelto."}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleToggleReportStatus(report.id)} className={report.done ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}>
                                  {report.done ? "Reabrir" : "Marcar como completado"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {hasRole("ROLE_ADMIN") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" disabled={isDeletingReport}><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar reporte?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer. El reporte será eliminado permanentemente.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReport(report.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
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
