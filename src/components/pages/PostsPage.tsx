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
import { Plus, Edit, Trash2, Search, Calendar, User, Loader2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import {
  useListPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePostByUser,
  useDeletePostByAdmin,
} from "@/features/post/queries"
import type { Post as PostType, DisplayPost } from "@/features/post/types"
import { api } from "@/lib/apiUpload" // usamos tu apiUpload.ts

export default function PostsPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<DisplayPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [] as string[],
  })
  const [isUploading, setIsUploading] = useState(false)

  // Queries
  const { data: postsData, isLoading, error } = useListPosts()

  // Mutations
  const { mutate: createPost, isPending: isCreating } = useCreatePost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: deletePostByUser } = useDeletePostByUser()
  const { mutate: deletePostByAdmin } = useDeletePostByAdmin()

  // Transformar datos de la API
  const posts: DisplayPost[] = useMemo(() => {
    if (!postsData) return []
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
    }))
  }, [postsData])

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 📤 Subida de imagen al servidor
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await api.post("/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const imageUrl = response.data.imageUrl
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))

      toast({
        title: "Imagen subida",
        description: "La imagen se subió correctamente.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "No se pudo subir la imagen.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Crear post
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
        images: formData.images,
      },
      {
        onSuccess: () => {
          setFormData({ title: "", content: "", images: [] })
          setIsCreateDialogOpen(false)
          toast({
            title: "¡Publicación creada!",
            description: "Tu publicación ha sido creada exitosamente.",
          })
        },
        onError: (error) => {
          console.error("Error creating post:", error)
          toast({
            title: "Error",
            description: "No se pudo crear la publicación.",
            variant: "destructive",
          })
        },
      }
    )
  }

  // Editar post
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
          images: formData.images,
        },
      },
      {
        onSuccess: () => {
          setEditingPost(null)
          setFormData({ title: "", content: "", images: [] })
          toast({
            title: "¡Publicación actualizada!",
            description: "Los cambios se guardaron exitosamente.",
          })
        },
        onError: (error) => {
          console.error("Error updating post:", error)
          toast({
            title: "Error",
            description: "No se pudo actualizar la publicación.",
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleDeletePost = (post: DisplayPost) => {
    const isAdmin = user?.roles?.includes("ROLE_ADMIN")
    const postId = Number(post.id)
    const userId = Number(user?.id)

    const mutation = isAdmin
      ? deletePostByAdmin.bind(null, postId)
      : deletePostByUser.bind(null, { id: postId, userId })

    mutation({
      onSuccess: () =>
        toast({
          title: "Publicación eliminada",
          description: "La publicación fue eliminada exitosamente.",
        }),
      onError: (error: any) => {
        console.error("Error deleting post:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar la publicación.",
          variant: "destructive",
        })
      },
    })
  }

  const openEditDialog = (post: DisplayPost) => {
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content, images: post.images || [] })
  }

  const canEditPost = (post: DisplayPost) =>
    isAuthenticated && (user?.id === post.authorId || (user?.roles ?? []).includes("ROLE_ADMIN"))

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
            <p className="text-gray-600 mt-2">
              Comparte y descubre iniciativas ambientales de la comunidad
            </p>
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
                  <DialogDescription>
                    Comparte tu experiencia o iniciativa ambiental
                  </DialogDescription>
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
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      placeholder="Describe tu iniciativa o proyecto ambiental..."
                      rows={6}
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Imagen (opcional)</label>
                    <div className="flex items-center gap-3 mt-1">
                      <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                      {isUploading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {formData.images.length > 0 && (
                      <img
                        src={formData.images[0]}
                        alt="Vista previa"
                        className="w-full h-40 object-cover rounded-md mt-3"
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setFormData({ title: "", content: "", images: [] })
                      }}
                      disabled={isCreating}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreatePost} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...
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

        {/* Filtro de búsqueda */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Listado de posts */}
        {!isLoading && !error && (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <User className="h-4 w-4" /> {post.authorName} •{" "}
                        <Calendar className="h-4 w-4" />{" "}
                        {new Date(post.postDate ?? "").toLocaleDateString() || "Fecha no disponible"}
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
                                Esta acción no se puede deshacer.
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
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  </div>
                )}

                <CardContent>
                  <p className="text-gray-700">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
