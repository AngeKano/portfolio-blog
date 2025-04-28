import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../infrastructure/db/prisma/client";
import { PrismaArticleRepository } from "../../../infrastructure/db/prisma/repositories/PrismaArticleRepository";
import { GetArticleUseCase } from "../../../application/useCases/article/GetArticleUseCase";
import { AnalyticsService } from "../../../infrastructure/services/analytics/AnalyticsService";
// import PublicHeader from '../../../ui/components/layouts/PublicHeader';
// import PublicFooter from '../../../ui/components/layouts/PublicFooter';
// import CommentSection from '../../../ui/components/blog/CommentSection';
// import ArticleContent from '../../../ui/components/blog/ArticleContent';
// import ArticleMeta from '../../../ui/components/blog/ArticleMeta';
// import ArticleSocialShare from '../../../ui/components/blog/ArticleSocialShare';
import {
  LuCalendar,
  LuClock,
  LuArrowLeft,
  LuTag,
  LuEye,
  LuHeart,
} from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import ArticleContent from "@/ui/components/blog/ArticleContent";

interface ArticlePageProps {
  params: {
    id: string;
  };
}

// Fonction pour estimer le temps de lecture
function getReadingTime(content: string): string {
  const wordsPerMinute = 200; // Vitesse de lecture moyenne
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de lecture`;
}

async function getArticle(id: string) {
  const articleRepository = new PrismaArticleRepository(prisma);
  const getArticleUseCase = new GetArticleUseCase(articleRepository);

  // Récupérer l'article avec ses commentaires
  const article = await getArticleUseCase.executeWithComments(id);

  // Si l'article n'existe pas ou n'est pas publié, retourner null
  if (!article || !article.published) {
    return null;
  }

  // Incrémenter le compteur de vues
  const analyticsService = new AnalyticsService();
  await analyticsService.trackArticleView(id);

  console.log("article__ ", article);

  return article;
}

// Récupérer les articles similaires (par tags)
async function getSimilarArticles(article: any) {
  if (!article || !article.tags || article.tags.length === 0) {
    return [];
  }

  // Trouver d'autres articles partageant au moins un tag avec cet article
  const similarArticles = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      published: true,
      tags: { hasSome: article.tags },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      publishedAt: true,
      tags: true,
    },
    take: 3,
  });

  return similarArticles;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.id);

  // Si l'article n'existe pas ou n'est pas publié, afficher une page 404
  if (!article) {
    notFound();
  }

  // Récupérer les articles similaires
  const similarArticles = await getSimilarArticles(article);

  return (
    <>
      {/* Header */}
      {/* <PublicHeader /> */}

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            <LuArrowLeft className="mr-2" /> Retour au blog
          </Link>
        </div>

        {/* En-tête de l'article */}
        <header className="mb-8">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100"
                >
                  <LuTag className="mr-1 w-4 h-4" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-6">{article.description}</p>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            {/* Auteur */}
            <div className="flex items-center">
              {article.author?.image ? (
                <img
                  src={article.author.image}
                  alt={article.author.name || "Auteur"}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                  {article.author?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {article.author?.name || "Auteur"}
                </p>
                <p className="text-gray-500">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Date de publication */}
              <div className="flex items-center">
                <LuCalendar className="w-4 h-4 mr-1" />
                <span>
                  {article.publishedAt
                    ? formatDistanceToNow(new Date(article.publishedAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : "Non publié"}
                </span>
              </div>

              {/* Temps de lecture */}
              <div className="flex items-center">
                <LuClock className="w-4 h-4 mr-1" />
                <span>{getReadingTime(article.content)}</span>
              </div>

              {/* Vues */}
              <div className="flex items-center">
                <LuEye className="w-4 h-4 mr-1" />
                <span>{article.views} vues</span>
              </div>

              {/* Likes */}
              <div className="flex items-center">
                <LuHeart className="w-4 h-4 mr-1" />
                <span>{article.likes} likes</span>
              </div>
            </div>
          </div>
        </header>

        {/* Image de couverture */}
        {article.image && (
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div className="prose prose-lg max-w-none mb-12">
          <ArticleContent content={article.content} />
        </div>

        {/* Liens de l'article */}
        {article.links && Object.keys(article.links).length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              {Object.entries(article.links).map(([key, value]) => (
                <li key={key}>
                  <strong className="capitalize">{key}:</strong>{" "}
                  <a
                    href={value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {value as string}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Partage social */}
        {/* <ArticleSocialShare
          title={article.title}
          url={`/blog/${article.id}`}
          description={article.description}
        /> */}
       

        {/* Section des commentaires */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Commentaires</h2>
          {/* <CommentSection articleId={article.id} comments={article.comments || []} /> */}
        </section>

        {/* Articles similaires */}
        {similarArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarArticles.map((similar: any) => (
                <Link
                  key={similar.id}
                  href={`/blog/${similar.id}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {similar.image ? (
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">
                        Image non disponible
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-primary-600 transition-colors">
                      {similar.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {similar.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      {/* <PublicFooter /> */}
    </>
  );
}
