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
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Organizaciones</CardTitle>
            <CardDescription>Administra organizaciones registradas</CardDescription>
          </div>

          <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Crear Organización
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear / Editar Organización</DialogTitle>
                <DialogDescription>Registra o actualiza una organización</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <ImageUploader onImageSelected={handleImageSelected} currentImage={orgForm.logo} label="Logo de la Organización (Opcional)" placeholder="Sube el logo de la organización" />

                <div>
                  <Label>Nombre *</Label>
                  <Input value={orgForm.name} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, name: e.target.value }))} placeholder="Nombre de la organización" />
                </div>

                <div>
                  <Label>Descripción *</Label>
                  <Textarea value={orgForm.description} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe la organización" rows={3} />
                </div>

                <div>
                  <Label>Asignar Creador (Dueño) *</Label>
                  <Select value={orgForm.creatorId?.toString() ?? ""} onValueChange={(value) => setOrgForm((prev: any) => ({ ...prev, creatorId: Number(value) }))} disabled={isLoadingComboboxUsers}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingComboboxUsers ? "Cargando usuarios..." : "Selecciona un usuario"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoadingComboboxUsers && usersForCombobox && usersForCombobox.length > 0 ? (
                        usersForCombobox.map((user: any) => <SelectItem key={user.id} value={user.id.toString()}>{user.name} {user.surname} ({user.email})</SelectItem>)
                      ) : (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={orgForm.contactEmail} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, contactEmail: e.target.value }))} placeholder="contacto@org.com" />
                  </div>
                  <div>
                    <Label>Teléfono *</Label>
                    <Input value={orgForm.contactPhone} onChange={(e) => setOrgForm((prev: any) => ({ ...prev, contactPhone: e.target.value }))} placeholder="+502 1234 5678" />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrgDialogOpen(false)} disabled={createOrgMutation.isPending || updateOrgMutation.isPending}>Cancelar</Button>
                <Button onClick={orgForm.editing ? handleEditOrganization : handleCreateOrganization} disabled={createOrgMutation.isPending || updateOrgMutation.isPending}>
                  {orgForm.editing ? (updateOrgMutation.isPending ? "Guardando..." : "Guardar Cambios") : (createOrgMutation.isPending ? "Creando..." : "Crear Organización")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar organizaciones..." value={orgSearch} onChange={(e) => setOrgSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="space-y-3">
          {filteredOrgs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay organizaciones disponibles</div>
          ) : (
            filteredOrgs.map((org) => (
              <Card key={org.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Logo */}
                    {org.logo && (
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          <Image src={org.logo} alt={org.name} fill className="object-contain p-2" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">{org.name}</h4>
                        <Badge className="text-xs sm:text-sm flex-shrink-0">{categoryLabels[org.category]}</Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{org.description}</p>

                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 flex-shrink-0" />{org.email}</div>
                        {org.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" />{org.phone}</div>}
                        {org.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" /><span className="line-clamp-1">{org.address}</span></div>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEditOrgDialog(org)} disabled={updateOrgMutation.isPending || deleteOrgMutation.isPending}><Edit className="h-4 w-4" /></Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" disabled={deleteOrgMutation.isPending}><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar organización?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción eliminará la organización y todos sus eventos asociados.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteOrganization(org.id)} disabled={deleteOrgMutation.isPending} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
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
