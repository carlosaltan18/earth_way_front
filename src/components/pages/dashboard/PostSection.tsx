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
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">Gestión de Publicaciones</CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base mt-1">Modera y administra publicaciones</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input placeholder="Buscar publicaciones..." value={postSearch} onChange={(e) => setPostSearch(e.target.value)} className="pl-8 sm:pl-10 text-xs sm:text-sm" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 break-words">{post.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{new Date(post.postDate).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t sm:border-t-0 sm:pt-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base sm:text-lg">¿Eliminar publicación?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs sm:text-sm">Esta acción no se puede deshacer. La publicación será eliminada permanentemente.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                          <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePost(post.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-xs sm:text-sm">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
