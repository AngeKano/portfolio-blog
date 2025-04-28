"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { LuLoader, LuUser } from "react-icons/lu";
import { useNotificationContext } from "../../context/NotificationContext";

interface Comment {
  id: string;
  content: string;
  email: string;
  name?: string;
  createdAt: string | Date;
}

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
  comments: initialComments,
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [name, setName] = useState(session?.user?.name || "");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useNotificationContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      showError("Vous devez être connecté pour commenter");
      return;
    }

    if (!content.trim()) {
      showError("Le commentaire ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          name: name || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du commentaire");
      }

      const newComment = await response.json();

      // Ajouter le nouveau commentaire à la liste
      setComments([newComment, ...comments]);
      setContent(""); // Réinitialiser le formulaire
      success("Commentaire ajouté avec succès");
    } catch (err) {
      showError("Impossible d'ajouter le commentaire");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Formulaire de commentaire */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom (optionnel)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Votre nom"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Commentaire <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Votre commentaire..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="animate-spin mr-2" />
                  Envoi...
                </>
              ) : (
                "Publier"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <p className="text-center text-gray-600">
            Vous devez être{" "}
            <a
              href="/login"
              className="text-primary-600 hover:text-primary-800"
            >
              connecté
            </a>{" "}
            pour laisser un commentaire.
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <LuUser className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {comment.name || "Anonyme"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                    {comment.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
