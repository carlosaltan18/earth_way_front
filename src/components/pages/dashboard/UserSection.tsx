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
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Gestión de Usuarios</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base mt-1">Administra usuarios de la plataforma</CardDescription>
            {usersData && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Total: {usersData.totalElements} usuarios</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            placeholder="Buscar usuarios..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="pl-8 sm:pl-10 text-xs sm:text-sm"
          />
        </div>

        {isLoading && (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-500 text-xs sm:text-sm">Cargando usuarios...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-6 sm:py-8 bg-red-50 rounded-lg">
            <p className="text-red-500 text-xs sm:text-sm">Error al cargar usuarios</p>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No hay usuarios</div>
        )}

        <div className="space-y-2 sm:space-y-3">
          {users.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base break-words flex-1 min-w-0">{user.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role: string) => (
                          <Badge key={role} variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">{role}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t sm:border-t-0 sm:pt-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs sm:text-sm">Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openRoleDialog(user)} className="text-xs sm:text-sm">
                          <UserCog className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> Gestionar Roles
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-3 sm:mt-4">
            <Button 
              variant="outline" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 0}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Anterior
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 order-first sm:order-none">
              Página {page + 1} de {usersData.totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setPage(page + 1)} 
              disabled={page >= usersData.totalPages - 1}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
