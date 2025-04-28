import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "../../infrastructure/db/prisma/client";
import { PrismaArticleRepository } from "../../infrastructure/db/prisma/repositories/PrismaArticleRepository";
import { ListArticlesUseCase } from "../../application/useCases/article/ListArticlesUseCase";
// import PublicHeader from '../../ui/components/layouts/PublicHeader';
// import PublicFooter from '../../ui/components/layouts/PublicFooter';
import { LuCalendar, LuClock, LuLoader, LuTag } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import PublicFooter from "@/ui/components/layouts/PublicFooter";

interface BlogPageProps {
  searchParams: {
    page?: string;
    tag?: string;
    search?: string;
  };
}

async function getArticles(props: BlogPageProps) {
  const { page = "1", tag, search } = props.searchParams;
  const pageNumber = parseInt(page, 10) || 1;
  const limit = 9; // Nombre d'articles par page

  const articleRepository = new PrismaArticleRepository(prisma);
  const listArticlesUseCase = new ListArticlesUseCase(articleRepository);

  // Si un tag est spécifié, récupérer les articles par tag
  if (tag) {
    return await listArticlesUseCase.executeByTag(tag, {
      page: pageNumber,
      limit,
    });
  }

  // Sinon, récupérer tous les articles publiés
  return await listArticlesUseCase.execute(
    {
      page: pageNumber,
      limit,
      searchTerm: search,
      sortBy: "publishedAt",
      sortOrder: "desc",
    },
    true // Uniquement les articles publiés
  );
}

// Fonction pour estimer le temps de lecture
function getReadingTime(content: string): string {
  const wordsPerMinute = 200; // Vitesse de lecture moyenne
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

export default async function BlogPage(props: BlogPageProps) {
  const { data: articles, pagination } = await getArticles(props);

  // Récupérer tous les tags disponibles pour le filtre
  const allTags = await prisma.article.findMany({
    where: { published: true },
    select: { tags: true },
  });

  // Extraire les tags uniques
  const uniqueTags = Array.from(
    new Set(allTags.flatMap((article) => article.tags))
  ).filter(Boolean) as string[];

  const selectedTag = props.searchParams.tag;

  return (
    <>
      {/* Header */}
      {/* <PublicHeader /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Découvrez mes articles sur le développement web, les nouvelles
            technologies et les bonnes pratiques de programmation.
          </p>

          {/* Barre de recherche */}
          <div className="mt-8 max-w-md mx-auto">
            <form action="/blog" method="GET" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Rechercher un article..."
                defaultValue={props.searchParams.search || ""}
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filtres par tags */}
      <section className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filtrer par tag:
            </span>
            <Link
              href="/blog"
              className={`px-3 py-1 text-sm rounded-full ${
                !selectedTag
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tous
            </Link>
            {uniqueTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTag === tag
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <LuLoader className="w-10 h-10 text-primary-600 animate-spin" />
              </div>
            }
          >
            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Image de l'article */}
                      <Link href={`/blog/${article.id}`}>
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">
                              Image non disponible
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="p-6">
                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Link
                                key={tag}
                                href={`/blog?tag=${encodeURIComponent(tag)}`}
                                className="inline-flex items-center text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded-full hover:bg-primary-100"
                              >
                                <LuTag className="mr-1 w-3 h-3" />
                                {tag}
                              </Link>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                +{article.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Titre et description */}
                        <Link href={`/blog/${article.id}`}>
                          <h2 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
                            {article.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Métadonnées */}
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <div className="flex items-center mr-4">
                            <LuCalendar className="w-4 h-4 mr-1" />
                            <span>
                              {article.publishedAt
                                ? formatDistanceToNow(
                                    new Date(article.publishedAt),
                                    {
                                      addSuffix: true,
                                      locale: fr,
                                    }
                                  )
                                : "Non publié"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <LuClock className="w-4 h-4 mr-1" />
                            <span>{getReadingTime(article.content)}</span>
                          </div>
                        </div>

                        {/* Lien pour lire plus */}
                        <Link
                          href={`/blog/${article.id}`}
                          className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
                        >
                          Lire l'article
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="inline-flex">
                      <Link
                        href={`/blog?page=${pagination.currentPage - 1}${
                          selectedTag ? `&tag=${selectedTag}` : ""
                        }${
                          props.searchParams.search
                            ? `&search=${props.searchParams.search}`
                            : ""
                        }`}
                        className={`px-4 py-2 text-sm border border-gray-300 bg-white text-gray-700 rounded-l-md ${
                          pagination.currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                        aria-disabled={pagination.currentPage === 1}
                        tabIndex={pagination.currentPage === 1 ? -1 : undefined}
                      >
                        Précédent
                      </Link>
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Link
                          key={page}
                          href={`/blog?page=${page}${
                            selectedTag ? `&tag=${selectedTag}` : ""
                          }${
                            props.searchParams.search
                              ? `&search=${props.searchParams.search}`
                              : ""
                          }`}
                          className={`px-4 py-2 text-sm border-t border-b border-gray-300 ${
                            page === pagination.currentPage
                              ? "bg-primary-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </Link>
                      ))}
                      <Link
                        href={`/blog?page=${pagination.currentPage + 1}${
                          selectedTag ? `&tag=${selectedTag}` : ""
                        }${
                          props.searchParams.search
                            ? `&search=${props.searchParams.search}`
                            : ""
                        }`}
                        className={`px-4 py-2 text-sm border border-gray-300 bg-white text-gray-700 rounded-r-md ${
                          pagination.currentPage === pagination.totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                        aria-disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        tabIndex={
                          pagination.currentPage === pagination.totalPages
                            ? -1
                            : undefined
                        }
                      >
                        Suivant
                      </Link>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                  Aucun article trouvé
                </h2>
                <p className="text-gray-500 mb-8">
                  {selectedTag
                    ? `Aucun article trouvé avec le tag "${selectedTag}".`
                    : props.searchParams.search
                    ? `Aucun résultat pour "${props.searchParams.search}".`
                    : "Aucun article publié pour le moment."}
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Voir tous les articles
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </>
  );
}
