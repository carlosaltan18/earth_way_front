"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Calendar, User } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  content: string
  postDate: string
  images?: string[]
  authorId: string
  authorName: string
}

// Mock posts data with images
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Reforestación en el Parque Nacional",
    content:
      "Hoy participamos en una jornada increíble de reforestación en el Parque Nacional. Plantamos más de 200 árboles nativos y educamos a las familias sobre la importancia de conservar nuestros bosques.",
    postDate: "2024-01-15",
    authorId: "1",
    authorName: "Admin Usuario",
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "2",
    title: "Limpieza de Playa Comunitaria",
    content:
      "Organizamos una limpieza de playa que reunió a más de 50 voluntarios. Recolectamos 15 bolsas de basura y reciclamos materiales plásticos. ¡Juntos podemos mantener nuestras costas limpias!",
    postDate: "2024-01-10",
    authorId: "2",
    authorName: "Usuario Regular",
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "3",
    title: "Taller de Compostaje Urbano",
    content:
      "Realizamos un taller educativo sobre compostaje urbano en el centro comunitario. Los participantes aprendieron técnicas para reducir residuos orgánicos y crear abono natural para sus jardines.",
    postDate: "2024-01-08",
    authorId: "3",
    authorName: "EcoOrg",
    images: ["/placeholder.svg?height=300&width=500"],
  },
]

export default function PostsPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreatePost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      postDate: new Date().toISOString().split("T")[0],
      authorId: user!.id,
      authorName: user!.name,
    }

    setPosts((prev) => [newPost, ...prev])
    setFormData({ title: "", content: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "¡Publicación creada!",
      description: "Tu publicación ha sido creada exitosamente.",
    })
  }

  const handleEditPost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === editingPost!.id ? { ...post, title: formData.title, content: formData.content } : post,
      ),
    )

    setEditingPost(null)
    setFormData({ title: "", content: "" })

    toast({
      title: "¡Publicación actualizada!",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
    toast({
      title: "Publicación eliminada",
      description: "La publicación ha sido eliminada exitosamente.",
    })
  }

  const openEditDialog = (post: Post) => {
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content })
  }

  const canEditPost = (post: Post) => {
    return isAuthenticated && (user?.id === post.authorId || user?.roles.includes("ADMIN"))
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
            <p className="text-gray-600 mt-2">Comparte y descubre iniciativas ambientales de la comunidad</p>
          </div>

          {isAuthenticated && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Publicación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Publicación</DialogTitle>
                  <DialogDescription>Comparte tu experiencia o iniciativa ambiental con la comunidad</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Título de tu publicación"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contenido</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Describe tu iniciativa, experiencia o proyecto ambiental..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreatePost}>Publicar</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add this after the search section and before the posts grid */}
        {!isAuthenticated && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">¡Únete a la Comunidad!</h3>
                <p className="text-green-700 mb-4">
                  Regístrate para crear tus propias publicaciones y participar en la conversación ambiental.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/auth/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No se encontraron publicaciones que coincidan con tu búsqueda."
                    : "No hay publicaciones aún. ¡Sé el primero en compartir!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.postDate).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                    </div>

                    {canEditPost(post) && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {post.images && post.images.length > 0 && (
                  <div className="px-6">
                    <img
                      src={post.images[0] || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </div>
                )}
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Publicación</DialogTitle>
              <DialogDescription>Actualiza el contenido de tu publicación</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de tu publicación"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contenido</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe tu iniciativa, experiencia o proyecto ambiental..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditPost}>Guardar Cambios</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
