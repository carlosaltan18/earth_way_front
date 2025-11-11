"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Calendar, User } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function PostSection({
  filteredPosts,
  postSearch,
  setPostSearch,
  handleDeletePost,
}: {
  filteredPosts: any[];
  postSearch: string;
  setPostSearch: (v: string) => void;
  handleDeletePost: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Publicaciones</CardTitle>
        <CardDescription>Modera y administra publicaciones</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar publicaciones..." value={postSearch} onChange={(e) => setPostSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1"><User className="h-4 w-4" />{post.authorName}</div>
                      <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.postDate).toLocaleDateString("es-ES")}</div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer. La publicación será eliminada permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePost(post.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
