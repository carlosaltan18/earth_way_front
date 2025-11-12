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
import {
  useListPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePostByUser,
  useDeletePostByAdmin,
} from "@/features/post/queries"
import type { Post as PostType, DisplayPost } from "@/features/post/types"
import { api } from "@/lib/apiUpload"

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

  // Transformar datos
  const posts: DisplayPost[] = useMemo(() => {
    if (!postsData) return []
    return postsData.payload.map((post: PostType): DisplayPost => ({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      postDate: post.postDate || new Date().toISOString().split("T")[0],
      authorId: post.author?.id?.toString() || post.authorId?.toString() || "",
      authorEmail: post.author?.email || "",
      authorName: post.author
        ? `${post.author.name} ${post.author.surname}`.trim()
        : "Autor desconocido",
      images: post.images || [],
    }))
  }, [postsData])

  // Filtrar por búsqueda
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Subir imagen
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
      setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }))
      toast({ title: "Imagen subida", description: "La imagen se subió correctamente." })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ title: "Error", description: "No se pudo subir la imagen.", variant: "destructive" })
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
          toast({ title: "¡Publicación creada!", description: "Tu publicación ha sido creada." })
        },
        onError: (error) => {
          console.error("Error creating post:", error)
          toast({ title: "Error", description: "No se pudo crear la publicación.", variant: "destructive" })
        },
      }
    )
  }

  // Editar post (solo autor)
  const handleEditPost = () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) return
    // allow editing only if the logged user is the author (compare both email and id)
    const isAuthor = String(user?.email) === String(editingPost.authorEmail) || String(user?.id) === String(editingPost.authorId)
    if (!isAuthor) {
      toast({ title: "Permiso denegado", description: "No puedes editar este post.", variant: "destructive" })
      return
    }

    updatePost(
      {
        id: Number(editingPost.id),
        // use the numeric authorId from the post (backend expects numeric userId)
        userId: Number(editingPost.authorId),
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
          toast({ title: "¡Publicación actualizada!", description: "Cambios guardados correctamente." })
        },
        onError: (error) => {
          console.error("Error updating post:", error)
          toast({ title: "Error", description: "No se pudo actualizar la publicación.", variant: "destructive" })
        },
      }
    )
  }

  // Eliminar post (autor o admin)
  const handleDeletePost = (post: DisplayPost) => {
    const postId = Number(post.id)
    const isAdminUser = user?.roles?.includes("ROLE_ADMIN")
    const isAuthor = String(user?.email) === String(post.authorEmail) || String(user?.id) === String(post.authorId)

    if (!isAdminUser && !isAuthor) {
      toast({ title: "Permiso denegado", description: "No puedes eliminar este post.", variant: "destructive" })
      return
    }

    if (isAdminUser) {
      deletePostByAdmin(postId, {
        onSuccess: () => {
          toast({ title: "Publicación eliminada", description: "Se eliminó correctamente." })
        },
        onError: (error: any) => {
          console.error("Error deleting post:", error)
          toast({ title: "Error", description: "No se pudo eliminar la publicación.", variant: "destructive" })
        },
      })
    } else {
      // pass the numeric authorId (post.authorId) as userId so backend receives a valid numeric id
      deletePostByUser({ id: postId, userId: Number(post.authorId) }, {
        onSuccess: () => {
          toast({ title: "Publicación eliminada", description: "Se eliminó correctamente." })
        },
        onError: (error: any) => {
          console.error("Error deleting post:", error)
          toast({ title: "Error", description: "No se pudo eliminar la publicación.", variant: "destructive" })
        },
      })
    }
  }

  const openEditDialog = (post: DisplayPost) => {
    // allow editing only if the logged user is the author (compare both email and id)
    const isAuthor = String(user?.email) === String(post.authorEmail) || String(user?.id) === String(post.authorId)
    if (!isAuthor) {
      toast({ title: "Acceso denegado", description: "No puedes editar este post.", variant: "destructive" })
      return
    }
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content, images: post.images || [] })
  }

  const isAdmin = user?.roles?.includes("ROLE_ADMIN")

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
          {isAuthenticated && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nueva Publicación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Publicación</DialogTitle>
                  <DialogDescription>Comparte tu proyecto ambiental</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Contenido..."
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  />
                  <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreatePost} disabled={isCreating}>
                      {isCreating ? <Loader2 className="animate-spin h-4 w-4" /> : "Publicar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Dialog de Edición */}
        {isAuthenticated && (
          <Dialog open={!!editingPost} onOpenChange={(open) => {
            if (!open) {
              setEditingPost(null)
              setFormData({ title: "", content: "", images: [] })
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Publicación</DialogTitle>
                <DialogDescription>Modifica el contenido de tu publicación</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Título"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  disabled={isUpdating}
                />
                <Textarea
                  placeholder="Contenido..."
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  disabled={isUpdating}
                />
                <div>
                  <label className="text-sm font-medium">Imagen (opcional)</label>
                  <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </div>
                {formData.images.length > 0 && (
                  <img
                    src={formData.images[0]}
                    alt="Vista previa"
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPost(null)
                      setFormData({ title: "", content: "", images: [] })
                    }}
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleEditPost} disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : "Guardar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar publicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Posts */}
        {!isLoading && !error && (
          <div className="grid gap-6">
            {filteredPosts.map((post) => {
              const isAuthor = String(user?.email) === String(post.authorEmail) || String(user?.id) === String(post.authorId)
              return (
              <Card key={post.id}>
                <div className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <div className="text-sm text-gray-500 flex gap-2 items-center mt-2">
                      <User className="h-4 w-4" /> {post.authorName} •{" "}
                      <Calendar className="h-4 w-4" /> {new Date(post.postDate ?? "").toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {isAuthor && (
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {(isAdmin || isAuthor) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
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
                    )}
                  </div>
                </div>

                {post.images?.length > 0 && (
                  <div className="px-6 pb-4">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}

                <div className="px-6 pb-6">
                  <p className="text-gray-700">{post.content}</p>
                </div>
              </Card>
            )})}
          </div>
        )}
      </div>
    </Layout>
  )
}
