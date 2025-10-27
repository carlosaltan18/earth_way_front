"use client"

import { useState, useMemo } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Calendar, User, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  useListPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePostByUser,
  useDeletePostByAdmin,
} from "@/features/post/queries"
import type { Post as PostType, DisplayPost as DisplayPost } from "@/features/post/types"



export default function PostsPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<DisplayPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  // Queries
  const { data: postsData, isLoading, error } = useListPosts()

  // Mutations
  const { mutate: createPost, isPending: isCreating } = useCreatePost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: deletePostByUser } = useDeletePostByUser()
  const { mutate: deletePostByAdmin } = useDeletePostByAdmin()

  // Transform API data to display format
  const posts: DisplayPost[] = useMemo(() => {
    if (!postsData) return [];

    return postsData.payload.map((post: PostType): DisplayPost => ({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      postDate: post.postDate || new Date().toISOString().split("T")[0],
      authorId: post.author?.id?.toString() || post.authorId?.toString() || "",
      authorName: post.author
        ? `${post.author.name} ${post.author.surname}`.trim()
        : "Autor desconocido",
      images: post.images || [],
    }));
  }, [postsData]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
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

    createPost(
      {
        title: formData.title,
        content: formData.content,
        postDate: new Date().toISOString().split("T")[0],
        images: [],
      },
      {
        onSuccess: () => {
          setFormData({ title: "", content: "" })
          setIsCreateDialogOpen(false)
          toast({
            title: "¡Publicación creada!",
            description: "Tu publicación ha sido creada exitosamente.",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "No se pudo crear la publicación.",
            variant: "destructive",
          })
          console.error("Error creating post:", error)
        },
      }
    )
  }

  const handleEditPost = () => {
    if (!formData.title.trim() || !formData.content.trim() || !editingPost) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    updatePost(
      {
        id: Number(editingPost.id),
        userId: Number(user?.id),
        post: {
          title: formData.title,
          content: formData.content,
          postDate: editingPost.postDate,
          images: editingPost.images || [],
        },
      },
      {
        onSuccess: () => {
          setEditingPost(null)
          setFormData({ title: "", content: "" })
          toast({
            title: "¡Publicación actualizada!",
            description: "Los cambios han sido guardados exitosamente.",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "No se pudo actualizar la publicación.",
            variant: "destructive",
          })
          console.error("Error updating post:", error)
        },
      }
    )
  }

  const handleDeletePost = (post: DisplayPost) => {
    const isAdmin = user?.roles?.includes("ROLE_ADMIN")
    const postId = Number(post.id)
    const userId = Number(user?.id)

    if (isAdmin) {
      deletePostByAdmin(postId, {
        onSuccess: () => {
          toast({
            title: "Publicación eliminada",
            description: "La publicación ha sido eliminada exitosamente.",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "No se pudo eliminar la publicación.",
            variant: "destructive",
          })
          console.error("Error deleting post:", error)
        },
      })
    } else {
      deletePostByUser(
        { id: postId, userId },
        {
          onSuccess: () => {
            toast({
              title: "Publicación eliminada",
              description: "La publicación ha sido eliminada exitosamente.",
            })
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "No se pudo eliminar la publicación.",
              variant: "destructive",
            })
            console.error("Error deleting post:", error)
          },
        }
      )
    }
  }

  const openEditDialog = (post: DisplayPost) => {
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content })
  }

  const canEditPost = (post: DisplayPost) =>
    isAuthenticated && (user?.id === post.authorId || (user?.roles ?? []).includes("ROLE_ADMIN"))

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
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contenido</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Describe tu iniciativa, experiencia o proyecto ambiental..."
                      rows={6}
                      disabled={isCreating}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setFormData({ title: "", content: "" })
                      }}
                      disabled={isCreating}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreatePost} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        "Publicar"
                      )}
                    </Button>
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

        {/* Login prompt for non-authenticated users */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="ml-3 text-gray-500">Cargando publicaciones...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error al cargar las publicaciones. Por favor, intenta de nuevo.</p>
            </CardContent>
          </Card>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && (
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
                            {(() => {
                              const d = post.postDate ? new Date(post.postDate) : null
                              return d && !isNaN(d.getTime()) ? d.toLocaleDateString("es-ES") : "—"
                            })()}
                          </div>
                        </div>
                      </div>

                      {canEditPost(post) && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
        )}

        {/* Edit Dialog */}
        <Dialog
          open={!!editingPost}
          onOpenChange={() => {
            setEditingPost(null)
            setFormData({ title: "", content: "" })
          }}
        >
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
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contenido</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe tu iniciativa, experiencia o proyecto ambiental..."
                  rows={6}
                  disabled={isUpdating}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPost(null)
                    setFormData({ title: "", content: "" })
                  }}
                  disabled={isUpdating}
                >
                  Cancelar
                </Button>
                <Button onClick={handleEditPost} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}