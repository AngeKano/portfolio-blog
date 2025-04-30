import Link from "next/link";
import { prisma } from "../infrastructure/db/prisma/client";
import ListArticlesSection from "@/ui/components/blog/ListArticlesSection";

// Ajoutez cette ligne pour désactiver la mise en cache
export const dynamic = "force-dynamic";

async function getLatestContent() {
  // Récupérer les articles les plus récents
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" }, // Réactivez l'ordre et la limite
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      publishedAt: true,
    },
  });

  // Récupérer les projets les plus récents
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      technologies: true,
    },
  });

  // Récupérer les compétences principales
  const skills = await prisma.skill.findMany({
    take: 6,
    select: {
      id: true,
      name: true,
      category: true,
      image: true,
    },
  });


  return { articles, projects, skills };
}

export default async function Home() {
  const { articles, projects, skills } = await getLatestContent();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Portfolio Blog</h1>
            <p className="text-xl mb-8">
              Développeur passionné partageant des projets, des connaissances et
              des expériences dans le domaine du développement web.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/blog"
                className="bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Lire le Blog
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-700 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">À Propos</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                Je suis un développeur web full-stack passionné par la création
                d'applications web modernes et performantes. Mon expertise
                combine à la fois le front-end et le back-end, avec une
                attention particulière aux bonnes pratiques et à l'architecture
                propre du code.
              </p>
              <p>
                Ce portfolio-blog est conçu pour partager mes projets, mes
                connaissances et mes expériences avec la communauté. N'hésitez
                pas à parcourir mes articles et projets, ou à me contacter pour
                discuter de vos idées et projets.
              </p>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/about"
                className="inline-flex items-center text-primary-600 hover:text-primary-800"
              >
                En savoir plus sur moi
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Compétences</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white p-4 rounded-lg shadow-soft text-center hover:shadow-md transition-shadow"
              >
                {skill.image ? (
                  <div className="w-12 h-12 mx-auto mb-3">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {skill.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-medium">{skill.name}</h3>
                <span className="inline-block mt-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/skills"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              Voir toutes mes compétences
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Projets récents */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Projets Récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Image non disponible</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Voir le projet
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              Voir tous mes projets
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles récents */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Articles Récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Image non disponible</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Non publié"}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <Link
                    href={`/blog/${article.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Lire l'article
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              Voir tous les articles
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      {/* <ListArticlesSection /> */}

      {/* Call to Action */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Intéressé par une collaboration ?
          </h2>
          <p className="text-xl mb-8">
            N'hésitez pas à me contacter pour discuter de vos projets ou de vos
            idées.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Contactez-moi
          </Link>
        </div>
      </section>
    </main>
  );
}
