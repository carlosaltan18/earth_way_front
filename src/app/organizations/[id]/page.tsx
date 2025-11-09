// src/app/organizations/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
// Importa el hook y el tipo Organization real
import { useGetOrganization } from "@/features/organization/queries";
import type { Organization } from "@/features/organization/types"; // Asegúrate que este tipo coincida con OrganizationResponseDto
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Building,
  User as UserIcon,
} from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function OrganizationDetailPageApp() {
  const params = useParams();
  const id = params?.id;
  const organizationId =
    typeof id === "string" && !isNaN(parseInt(id, 10))
      ? parseInt(id, 10)
      : undefined;

  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useGetOrganization(organizationId as number);

  if (isLoading) {
    return (
      <Layout>
        {/* Usamos text-muted-foreground para el texto de carga */}
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">
            Cargando organización...
          </p>
        </div>
      </Layout>
    );
  }
  if (isError || !organization) {
    return (
      <Layout>
        {/* Usamos colores destructivos del tema */}
        <div className="max-w-2xl mx-auto mt-10 p-6 border border-destructive/50 bg-destructive/10 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Error al cargar la organización
          </h2>
          <p className="text-destructive/90 mb-6">
            {" "}
            {/* Color secundario destructivo */}
            {error?.message ||
              "No se encontró la organización o el ID es inválido."}
          </p>
          {/* Botón de enlace usa text-primary */}
          <Button variant="link" asChild className="text-sm text-primary">
            <Link href="/organizations">
              <ArrowLeft className="h-4 w-4 mr-1" /> Volver a la lista
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!organization) {
    return null;
  } // Check explícito

  // --- Renderizado de Detalles ---
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <Link href="/organizations">
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver a la lista
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-xl border border-border/40 rounded-lg">
          {/* Banner */}
          <div className="relative bg-gradient-to-br from-primary/10 via-background to-background p-8 border-b border-border/40">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                <AvatarImage
                  src={organization.logo || "/placeholder.svg"}
                  alt={organization.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-muted">
                  {" "}
                  {/* Usa color de fondo muted */}
                  {organization.name.length > 0 ? (
                    organization.name.charAt(0).toUpperCase()
                  ) : (
                    <Building />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                {/* Badge ya tiene sus propios colores */}
                <CardTitle className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                  {" "}
                  {/* Texto principal */}
                  {organization.name}
                </CardTitle>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Columna Principal */}
            <div className="lg:col-span-2 p-8 space-y-8">
              {/* Descripción */}
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4 border-l-4 border-primary pl-3">
                  {" "}
                  {/* Texto principal */}
                  Descripción
                </h3>
                {/* Texto secundario para la descripción */}
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {organization.description || (
                    <span className="italic">
                      No hay descripción disponible.
                    </span>
                  )}
                </p>
              </div>
              <Separator />
              {/* Contacto */}
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4 border-l-4 border-primary pl-3">
                  {" "}
                  {/* Texto principal */}
                  Contacto
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 text-sm text-foreground">
                    {" "}
                    {/* Texto principal */}
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>{" "}
                      {/* Usa el color por defecto (foreground) */}
                      {/* El enlace usa muted, cambia a primary al hacer hover */}
                      <a
                        href={`mailto:${organization.contactEmail}`}
                        className="text-muted-foreground hover:text-primary underline truncate"
                      >
                        {organization.contactEmail}
                      </a>
                    </div>
                  </div>
                  {/* Teléfono */}
                  {organization.contactPhone && (
                    <div className="flex items-start gap-3 text-sm text-foreground">
                      {" "}
                      {/* Texto principal */}
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Teléfono</p>{" "}
                        <span className="text-muted-foreground">
                          {organization.contactPhone}
                        </span>
                        <a
                          href={`tel:${organization.contactPhone}`}
                          className="text-muted-foreground hover:text-primary underline"
                        >
                          {organization.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Lateral */}
            <div className="lg:col-span-1 bg-muted/20 p-8 border-t lg:border-t-0 lg:border-l border-border/40 space-y-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {" "}
                {/* Texto principal */}
                Información Adicional
              </h3>
              <div className="space-y-4 text-sm">
                {/* Creador */}
                {organization.creatorId && (
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />{" "}
                    {/* Icono secundario */}
                    <div>
                      {/* Texto principal para el nombre */}
                      <p className="font-medium text-foreground">
                        ID: {organization.creatorId}
                      </p>
                      {/* Texto secundario para la etiqueta */}
                      <p className="text-muted-foreground">Creador</p>
                    </div>
                  </div>
                )}
                {/* Fecha */}
                {organization.created_at && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />{" "}
                    {/* Icono secundario */}
                    <div>
                      {/* Texto principal para la fecha */}
                      <p className="font-medium text-foreground">
                        {new Date(organization.created_at).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                      {/* Texto secundario para la etiqueta */}
                      <p className="text-muted-foreground">Fecha de Registro</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
