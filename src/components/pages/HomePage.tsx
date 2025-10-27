"use client"

import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, MapPin, Calendar, TreePine, Globe, FileText, AlertTriangle } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Juntos por un Planeta Verde
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto">
                EarthWay conecta personas y organizaciones para crear un impacto ambiental positivo a través de la
                reforestación colaborativa y acciones ecológicas.
              </p>
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                    <Link href="/auth/register">Únete Ahora</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                </div>
              ) : (
                <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                  <Link href="/events">Ver Eventos</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Explora EarthWay</h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre iniciativas ambientales, únete a eventos y mantente informado sobre reportes de la comunidad
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 md:p-8">
                  <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-green-200 transition-colors">
                    <FileText className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Publicaciones</h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                    Descubre historias inspiradoras y comparte tus experiencias ambientales con la comunidad
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/posts">Ver Publicaciones</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 md:p-8">
                  <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-200 transition-colors">
                    <Calendar className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Eventos</h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                    Participa en actividades de reforestación, limpieza y educación ambiental cerca de ti
                  </p>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/events">Explorar Eventos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 md:p-8">
                  <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-orange-200 transition-colors">
                    <AlertTriangle className="h-7 w-7 md:h-8 md:w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Reportes</h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                    Mantente informado sobre problemas ambientales y contribuye a su solución
                  </p>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/reports">Ver Reportes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">¿Cómo Funciona EarthWay?</h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Nuestra plataforma facilita la colaboración ambiental a través de herramientas intuitivas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Conecta y Colabora</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    Únete a una comunidad de personas comprometidas con el medio ambiente. Comparte experiencias y
                    aprende de otros.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Participa en Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    Descubre y participa en eventos de reforestación y actividades ecológicas organizadas por la
                    comunidad.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Explora el Mapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    Visualiza eventos y reportes ambientales en tiempo real a través de nuestro mapa interactivo.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Nuestro Impacto</h2>
              <p className="text-base sm:text-xl text-gray-600">Juntos estamos creando un cambio positivo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-green-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <TreePine className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">100+</div>
                <div className="text-gray-600 text-sm md:text-base">Árboles Plantados</div>
              </div>

              <div className="text-center">
                <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-green-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Users className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">150+</div>
                <div className="text-gray-600 text-sm md:text-base">Voluntarios Activos</div>
              </div>

              <div className="text-center">
                <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-green-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Globe className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">3+</div>
                <div className="text-gray-600 text-sm md:text-base">Organizaciones Aliadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">¿Listo para Hacer la Diferencia?</h2>
            <p className="text-base sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad y comienza a contribuir a un futuro más verde hoy mismo.
            </p>
            {!isAuthenticated ? (
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                <Link href="/auth/register">Comenzar Ahora</Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                <Link href="/posts">Explorar Publicaciones</Link>
              </Button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}
