// src/app/admin/articles/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotificationContext } from "../../../ui/context/NotificationContext";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuEye,
  LuEyeOff,
  LuLoader,
} from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArticleSummaryDTO } from "@/application/dtos/ArticleDTO";

export default function AdminArticles() {
  const [articles, setArticles] = useState<ArticleSummaryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const router = useRouter();
  const { success, error: showError } = useNotificationContext();

  // Charger les articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/articles?page=1&limit=10&search=&sortBy=title&sortOrder=asc&tag=&onlyPublished=false"
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des articles");
        }

        const data = await response.json();
        setArticles(data.data);
      } catch (err) {
        setError("Impossible de charger les articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fonction pour supprimer un article
  const deleteArticle = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/articles/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'article");
      }

      // Mettre à jour la liste d'articles
      setArticles(articles.filter((article) => article.id !== deleteId));
      success("Article supprimé avec succès");
    } catch (err) {
      showError("Impossible de supprimer l'article");
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Fonction pour ouvrir la modal de confirmation de suppression
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Fonction pour fermer la modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Fonction pour changer l'état de publication d'un article
  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'article");
      }

      // Mettre à jour la liste d'articles
      setArticles(
        articles.map((article) =>
          article.id === id
            ? {
                ...article,
                published: !currentStatus,
                publishedAt: !currentStatus
                  ? new Date().toISOString()
                  : article.publishedAt,
              }
            : article
        )
      );

      success(`Article ${!currentStatus ? "publié" : "dépublié"} avec succès`);
    } catch (err) {
      showError("Impossible de mettre à jour l'article");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <LuPlus className="mr-2" /> Nouvel article
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LuLoader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {article.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            article.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {article.published ? "Publié" : "Brouillon"}
                        </span>
                        {article.published && article.publishedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(article.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.likes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              togglePublishStatus(article.id, article.published)
                            }
                            className={`p-1 rounded ${
                              article.published
                                ? "text-yellow-600 hover:text-yellow-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            title={article.published ? "Dépublier" : "Publier"}
                          >
                            {article.published ? (
                              <LuEyeOff className="w-5 h-5" />
                            ) : (
                              <LuEye className="w-5 h-5" />
                            )}
                          </button>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Modifier"
                          >
                            <LuPencil className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(article.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Supprimer"
                          >
                            <LuTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Aucun article trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                onClick={deleteArticle}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <LuLoader className="animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
