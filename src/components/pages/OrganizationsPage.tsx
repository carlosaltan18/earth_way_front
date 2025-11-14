"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/use-debounce";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2,
  Building,
} from "lucide-react";
import {
  useGetOrganizations,
  useSearchOrganization,
} from "@/features/organization/queries";

import type { Organization } from "@/features/organization/types";

interface OrganizationCardData extends Organization {
  category?: "ngo" | "government" | "private" | "community";
  eventsCount?: number;
  members?: number;
  founded?: string;
}
const categoryLabels = {
  /* ... */
} as const;
const categoryColors = {
  /* ... */
} as const;

export default function OrganizationsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(0);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
    error: searchError,
  } = useSearchOrganization(debouncedSearchTerm);

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    isError: isListError,
    error: listError,
  } = useGetOrganizations(
    { page: page, size: 9 },
    debouncedSearchTerm.trim() === ""
  );

  let organizationsToDisplay: OrganizationCardData[] = [];
  let isLoading = false;
  let isError = false;
  let totalPages = 1;
  let error: Error | null = null;

  if (debouncedSearchTerm.trim() !== "") {
    organizationsToDisplay = searchData || [];
    isLoading = isSearchLoading || isSearchFetching;
    isError = isSearchError;
    error = searchError || null;
    totalPages = 1;
  } else {
    organizationsToDisplay = listData?.payload || [];
    isLoading = isListLoading || isListFetching;
    isError = isListError;
    error = listError || null;
    totalPages = listData?.totalPages || 1;
  }

  const errorMessage = error?.message || "Error desconocido";

  const organizationsWithMockData = organizationsToDisplay.map((org) => ({
    ...org,
    id: Number(org.id),
    category:
      Number(org.id) % 4 === 0
        ? "government"
        : Number(org.id) % 3 === 0
        ? "community"
        : "ngo",
    eventsCount: (Number(org.id) % 5) + 5,
    members: Number(org.id) * 10 + 20,
    founded: "2020-01-01",
  })) as OrganizationCardData[];

  // --- JSX ACTUALIZADO ---
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Organizaciones
            </h1>
            <p className="mt-2 text-lg font-medium">
              Descubre organizaciones comprometidas con el medio ambiente
            </p>
          </div>

          {/* Search Component */}
          <div className="relative mb-8">
            {" "}
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Busque una organización..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11" // Input más alto
            />
          </div>

          {/* Indicador de Carga/Error */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              {" "}
              {/* Más espacio */}
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground ml-3">
                Cargando organizaciones...
              </p>
            </div>
          )}
          {isError && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="text-center py-8">
                <p className="text-destructive font-semibold">
                  Error al cargar las organizaciones: {errorMessage}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Organizations Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {organizationsWithMockData.length === 0 ? (
                <Card className="lg:col-span-3 border-dashed">
                  <CardContent className="text-center py-16">
                    <p className="text-muted-foreground">
                      No se encontraron organizaciones que coincidan con tu
                      búsqueda.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                organizationsWithMockData.map((org) => (
                  <Card
                    key={org.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border/20 bg-card shadow-6xs transition-all duration-500 hover:shadow-2xl hover:border-primary/30"
                  >
                    <CardHeader className="p-6">
                      <div className="flex items-center gap-4 text-2xl">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                          <AvatarImage
                            src={org.logo || "/placeholder-user.jpg"}
                            alt={org.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl bg-muted">
                            {org.name.length > 0 ? (
                              org.name.charAt(0).toUpperCase()
                            ) : (
                              <Building />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold text-foreground">
                            {org.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Contenido con Acento */}
                    <CardContent className="flex-grow pt-0 p-0 space-y-1">
                      {/* Acento verde y Descripción */}
                      <div className="border-l-4 border-green-500 pl-4">
                        {" "}
                        {/* <-- ACENTO VERDE */}
                        <CardDescription className="text-muted-foreground text-sm line-clamp-3 h-[60px]">
                          {org.description}
                        </CardDescription>
                      </div>
                    </CardContent>

                    <CardContent className="flex-grow space-y-2">
                      <Separator />
                      <div className="grid grid-cols-3 gap-2 text-center py-2">
                        <div>
                          <Users className="h-5 w-5 mx-auto text-primary/70 mb-1" />
                          <p className="text-sm font-semibold text-foreground">
                            {org.members}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Miembros
                          </p>
                        </div>
                        <div>
                          <Calendar className="h-5 w-5 mx-auto text-primary/70 mb-1" />
                          <p className="text-sm font-semibold text-foreground">
                            {org.eventsCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Eventos
                          </p>
                        </div>
                        <div>
                          <Calendar className="h-5 w-5 mx-auto text-primary/70 mb-1" />
                          <p className="text-sm font-semibold text-foreground">
                            {new Date(
                              org.founded ?? "2000-01-01"
                            ).getFullYear()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Fundado
                          </p>
                        </div>
                      </div>
                      <Separator />

                      {/* --- Sección de Contacto (Real) --- */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a
                            href={`mailto:${org.contactEmail}`}
                            className="text-muted-foreground hover:text-primary truncate transition-colors"
                          >
                            {org.contactEmail}
                          </a>
                        </div>
                        {org.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <a
                              href={`tel:${org.contactPhone}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {org.contactPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto pt-4 border-t border-border/10">
                      {/* El botón ahora solo reacciona a su propio hover */}
                      <Button
                        asChild
                        variant="secondary"
                        className="w-full transition-all hover:bg-green-600 hover:text-primary-foreground"
                      >
                        <Link href={`/organizations/${org.id}`} passHref>
                          Ver Perfil
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Paginación */}
          {!isLoading &&
            !isError &&
            debouncedSearchTerm.trim() === "" &&
            totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || isListFetching}
                  variant="outline"
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page + 1} de {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1 || isListFetching}
                  variant="outline"
                >
                  Siguiente
                </Button>
              </div>
            )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
