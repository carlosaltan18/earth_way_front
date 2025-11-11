"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Mail, Phone, MoreVertical, UserCog, Search } from "lucide-react";
import type { PaginatedUsersResponse } from "@/features/user/types";

export default function UserSection<TUser extends any>({
  users,
  userSearch,
  setUserSearch,
  isLoading,
  isError,
  usersData,
  page,
  setPage,
  openRoleDialog,
}: {
  users: TUser[];
  userSearch: string;
  setUserSearch: (v: string) => void;
  isLoading: boolean;
  isError: boolean;
  usersData?: PaginatedUsersResponse | null;
  page: number;
  setPage: (p: number) => void;
  openRoleDialog: (user: any) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Gestión de Usuarios</CardTitle>
            <CardDescription className="text-sm sm:text-base">Administra usuarios de la plataforma</CardDescription>
            {usersData && (
              <p className="text-sm text-gray-500 mt-1">Total: {usersData.totalElements} usuarios</p>
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

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Error al cargar usuarios</p>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="text-center py-8 text-gray-500">No hay usuarios</div>
        )}

        <div className="space-y-3">
          {users.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base">{user.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role: string) => (
                          <Badge key={role} variant="secondary" className="text-xs sm:text-sm">{role}</Badge>
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
                          <UserCog className="h-4 w-4 mr-2" /> Gestionar Roles
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

        {usersData && usersData.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 0}>
              Anterior
            </Button>
            <span className="text-sm text-gray-600">Página {page + 1} de {usersData.totalPages}</span>
            <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= usersData.totalPages - 1}>
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
