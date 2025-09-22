"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Users, Calendar, Mail, Phone } from "lucide-react"

interface Organization {
  id: string
  name: string
  description: string
  contact: {
    email: string
    phone?: string
    address?: string
  }
  logo?: string
  members: number
  eventsCount: number
  founded: string
  category: "ngo" | "government" | "private" | "community"
}

// Mock organizations data
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "EcoLima",
    description:
      "Organización dedicada a la reforestación urbana y educación ambiental en Lima. Trabajamos con comunidades locales para crear espacios verdes sostenibles.",
    contact: {
      email: "contacto@ecolima.org",
      phone: "+51 1 234-5678",
      address: "Av. Arequipa 1234, Lima, Perú",
    },
    members: 150,
    eventsCount: 25,
    founded: "2018-03-15",
    category: "ngo",
  },
  {
    id: "2",
    name: "OceanGuard",
    description:
      "Protegemos nuestros océanos y costas a través de actividades de limpieza, investigación marina y programas educativos para la conservación.",
    contact: {
      email: "info@oceanguard.pe",
      phone: "+51 1 987-6543",
      address: "Malecón de la Costa Verde, Miraflores",
    },
    members: 89,
    eventsCount: 18,
    founded: "2020-07-22",
    category: "ngo",
  },
  {
    id: "3",
    name: "Verde Comunitario",
    description:
      "Iniciativa comunitaria que promueve la agricultura urbana, compostaje y prácticas sostenibles en barrios de Lima.",
    contact: {
      email: "hola@verdecomunitario.com",
      address: "San Juan de Miraflores, Lima",
    },
    members: 45,
    eventsCount: 12,
    founded: "2021-01-10",
    category: "community",
  },
  {
    id: "4",
    name: "Ministerio del Ambiente",
    description:
      "Entidad gubernamental encargada de la política ambiental nacional y la coordinación de acciones de conservación y sostenibilidad.",
    contact: {
      email: "consultas@minam.gob.pe",
      phone: "+51 1 611-6000",
      address: "Av. Javier Prado Oeste 1440, San Isidro",
    },
    members: 500,
    eventsCount: 45,
    founded: "2008-05-14",
    category: "government",
  },
]

const categoryLabels = {
  ngo: "ONG",
  government: "Gubernamental",
  private: "Privada",
  community: "Comunitaria",
}

const categoryColors = {
  ngo: "bg-green-100 text-green-800",
  government: "bg-blue-100 text-blue-800",
  private: "bg-purple-100 text-purple-800",
  community: "bg-orange-100 text-orange-800",
}

export default function OrganizationsPage() {
  const { user } = useAuth()
  const [organizations] = useState<Organization[]>(mockOrganizations)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryLabels[org.category].toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Organizaciones</h1>
            <p className="text-gray-600 mt-2">Descubre organizaciones comprometidas con el medio ambiente</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar organizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Organizations Grid */}
          <div className="grid gap-6">
            {filteredOrganizations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No se encontraron organizaciones que coincidan con tu búsqueda.</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrganizations.map((org) => (
                <Card key={org.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={org.logo || "/placeholder.svg"} alt={org.name} />
                        <AvatarFallback className="text-lg">{org.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{org.name}</CardTitle>
                          <Badge className={categoryColors[org.category]}>{categoryLabels[org.category]}</Badge>
                        </div>

                        <CardDescription className="text-base mb-4">{org.description}</CardDescription>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                            <span>Desde {new Date(org.founded).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${org.contact.email}`} className="text-green-600 hover:text-green-700">
                          {org.contact.email}
                        </a>
                      </div>

                      {org.contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${org.contact.phone}`} className="text-green-600 hover:text-green-700">
                            {org.contact.phone}
                          </a>
                        </div>
                      )}

                      {org.contact.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{org.contact.address}</span>
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
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
