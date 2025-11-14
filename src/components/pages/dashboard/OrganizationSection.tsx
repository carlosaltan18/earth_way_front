"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Users } from "lucide-react";
import ImageUploader from "@/components/upload/ImageUploader";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus } from "lucide-react";

export default function OrganizationSection({
  organizations,
  orgSearch,
  setOrgSearch,
  filteredOrgs,
  isOrgDialogOpen,
  setIsOrgDialogOpen,
  orgForm,
  setOrgForm,
  usersForCombobox,
  isLoadingComboboxUsers,
  createOrgMutation,
  updateOrgMutation,
  deleteOrgMutation,
  handleImageSelected,
  handleCreateOrganization,
  handleEditOrganization,
  handleDeleteOrganization,
  openEditOrgDialog,
  categoryLabels,
}: {
  organizations: any[];
  orgSearch: string;
  setOrgSearch: (v: string) => void;
  filteredOrgs: any[];
  isOrgDialogOpen: boolean;
  setIsOrgDialogOpen: (b: boolean) => void;
  orgForm: any;
  setOrgForm: (f: any) => void;
  usersForCombobox: any[] | undefined;
  isLoadingComboboxUsers: boolean;
  createOrgMutation: any;
  updateOrgMutation: any;
  deleteOrgMutation: any;
  handleImageSelected: (url: string) => void;
  handleCreateOrganization: () => void;
  handleEditOrganization: () => void;
  handleDeleteOrganization: (id: string) => void;
  openEditOrgDialog: (org: any) => void;
  categoryLabels: Record<string, string>;
}) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Gestión de Organizaciones</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base mt-1">Administra organizaciones registradas</CardDescription>
          </div>

          <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> Crear Organización
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Crear / Editar Organización</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">Registra o actualiza una organización</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4">
                <ImageUploader onImageSelected={handleImageSelected} currentImage={orgForm.logo} label="Logo de la Organización (Opcional)" placeholder="Sube el logo de la organización" />

                <div>
                  <Label className="text-xs sm:text-sm">Nombre *</Label>
                  <Input value={orgForm.name} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, name: e.target.value }))} placeholder="Nombre de la organización" className="text-xs sm:text-sm" />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Descripción *</Label>
                  <Textarea value={orgForm.description} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe la organización" rows={3} className="text-xs sm:text-sm resize-none" />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Asignar Creador (Dueño) *</Label>
                  <Select value={orgForm.creatorId?.toString() ?? ""} onValueChange={(value) => setOrgForm((prev: any) => ({ ...prev, creatorId: Number(value) }))} disabled={isLoadingComboboxUsers}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder={isLoadingComboboxUsers ? "Cargando usuarios..." : "Selecciona un usuario"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoadingComboboxUsers && usersForCombobox && usersForCombobox.length > 0 ? (
                        usersForCombobox.map((user: any) => <SelectItem key={user.id} value={user.id.toString()} className="text-xs sm:text-sm">{user.name} {user.surname} ({user.email})</SelectItem>)
                      ) : (
                        <SelectItem value="loading" disabled className="text-xs sm:text-sm">Cargando...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Email *</Label>
                    <Input type="email" value={orgForm.contactEmail} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, contactEmail: e.target.value }))} placeholder="contacto@org.com" className="text-xs sm:text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Teléfono *</Label>
                    <Input value={orgForm.contactPhone} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, contactPhone: e.target.value }))} placeholder="+502 1234 5678" className="text-xs sm:text-sm" />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                <Button variant="outline" onClick={() => setIsOrgDialogOpen(false)} disabled={createOrgMutation.isPending || updateOrgMutation.isPending} className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</Button>
                <Button onClick={orgForm.editing ? handleEditOrganization : handleCreateOrganization} disabled={createOrgMutation.isPending || updateOrgMutation.isPending} className="w-full sm:w-auto text-xs sm:text-sm">
                  {orgForm.editing ? (updateOrgMutation.isPending ? "Guardando..." : "Guardar Cambios") : (createOrgMutation.isPending ? "Creando..." : "Crear Organización")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input placeholder="Buscar organizaciones..." value={orgSearch} onChange={(e) => setOrgSearch(e.target.value)} className="pl-8 sm:pl-10 text-xs sm:text-sm" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          {filteredOrgs.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No hay organizaciones disponibles</div>
          ) : (
            filteredOrgs.map((org) => (
              <Card key={org.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Logo */}
                      {org.logo && (
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image src={org.logo} alt={org.name} fill className="object-contain p-1 sm:p-2" />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-2">
                          <h4 className="font-semibold text-sm sm:text-base break-words flex-1 min-w-0">{org.name}</h4>
                          <Badge className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0">{categoryLabels[org.category]}</Badge>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-3">{org.description}</p>

                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{org.email}</span>
                          </div>
                          {org.phone && (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{org.phone}</span>
                            </div>
                          )}
                          {org.address && (
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{org.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-2 border-t sm:border-t-0 sm:pt-0">
                      <Button variant="ghost" size="sm" onClick={() => openEditOrgDialog(org)} disabled={updateOrgMutation.isPending || deleteOrgMutation.isPending} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0" disabled={deleteOrgMutation.isPending}>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">¿Eliminar organización?</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">Esta acción eliminará la organización y todos sus eventos asociados.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                            <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteOrganization(org.id)} disabled={deleteOrgMutation.isPending} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-xs sm:text-sm">Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
