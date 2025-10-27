"use client";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import {
  useGetOrganizations,
  useSearchOrganization,
} from "@/features/organization/queries";

import type { Organization } from "@/features/organization/types";

interface OrganizationCardData extends Organization {
  // Aquí puedes añadir los campos que tu frontend espera y que no están en el DTO de Spring
  category?: "ngo" | "government" | "private" | "community";
  eventsCount?: number;
  members?: number;
  founded?: string;
}

const categoryLabels = {
  ngo: "ONG",
  government: "Gubernamental",
  private: "Privada",
  community: "Comunitaria",
} as const;

const categoryColors = {
  ngo: "bg-green-100 text-green-800",
  government: "bg-blue-100 text-blue-800",
  private: "bg-purple-100 text-purple-800",
  community: "bg-orange-100 text-orange-800",
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
  } = useSearchOrganization(debouncedSearchTerm);

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    isError: isListError,
  } = useGetOrganizations({ page: 0, size: 20 });

  let organizationsToDisplay: OrganizationCardData[] = [];
  let isLoading = false;
  let isError = false;

  if (searchTerm.trim() !== "") {
    organizationsToDisplay = searchData || [];
    isLoading = isSearchLoading || isSearchFetching;
    isError = isSearchError;
  } else {
    organizationsToDisplay = listData || [];
    isLoading = isListLoading || isListFetching;
    isError = isListError;
  }

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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Organizaciones</h1>
            <p className="text-gray-600 mt-2">
              Descubre organizaciones comprometidas con el medio ambiente
            </p>
          </div>

          {/* Search Component*/}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Busque una organización"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Indicador de Carga/Error */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mr-2" />
              <p className="text-lg text-gray-600">
                Cargando organizaciones...
              </p>
            </div>
          )}

          {isError && (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="text-center py-8">
                <p className="text-red-800 font-semibold">
                  Error al cargar las organizaciones. Inténtalo de nuevo.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Organizations Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizationsWithMockData.length === 0 ? (
                <Card className="lg:col-span-3">
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron organizaciones que coincidan con tu
                      búsqueda.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                organizationsWithMockData.map((org) => (
                  <Card
                    key={org.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={org.logo || "/placeholder.svg"}
                            alt={org.name}
                          />
                          <AvatarFallback className="text-lg">
                            {org.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">
                              {org.name}
                            </CardTitle>
                            {org.category ? (
                              <Badge className={categoryColors[org.category]}>
                                {categoryLabels[org.category]}
                              </Badge>
                            ) : (
                              <Badge className={categoryColors.community}>
                                Comunitaria
                              </Badge>
                            )}
                          </div>

                          <CardDescription className="text-base mb-4">
                            {org.description}
                          </CardDescription>

                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            {/* Campos simulados */}
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{org.members} miembros</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{org.eventsCount} eventos</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Desde{" "}
                                {new Date(
                                  org.founded ?? "2000-01-01"
                                ).getFullYear()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* ... (Contenido de contacto) ... */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a
                            href={`mailto:${org.contactEmail}`}
                            className="text-green-600 hover:text-green-700"
                          >
                            {org.contactEmail}
                          </a>
                        </div>

                        {org.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a
                              href={`tel:${org.contactPhone}`}
                              className="text-green-600 hover:text-green-700"
                            >
                              {org.contactPhone}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button variant="outline">Ver Perfil</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
