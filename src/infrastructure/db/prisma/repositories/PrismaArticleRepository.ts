// src/infrastructure/db/prisma/repositories/PrismaArticleRepository.ts
import { PrismaClient } from "@prisma/client";
import { Article, ArticleLinks } from "../../../../domain/entities/Article";
import { ArticleRepository } from "../../../../domain/repositories/ArticleRepository";
import {
  PaginationOptions,
  PaginatedResult,
  createPaginationMeta,
} from "../../../../application/dtos/PaginationDTO";

export class PrismaArticleRepository implements ArticleRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!article) return null;

    return this.mapPrismaArticleToDomain(article);
  }

  async findByIdWithComments(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!article) return null;

    return this.mapPrismaArticleToDomain(article);
  }

  async findAll(
    options: PaginationOptions & { onlyPublished?: boolean }
  ): Promise<PaginatedResult<Article>> {
    const {
      page = 1,
      limit = 10,
      searchTerm,
      sortBy = "createdAt",
      sortOrder = "desc",
      onlyPublished = false,
    } = options;

    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const where: any = {};

    if (onlyPublished) {
      where.published = true;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Exécuter la requête avec count pour obtenir le nombre total d'articles
    const [articles, totalItems] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    // Mapper les résultats
    const data = articles.map((article) =>
      this.mapPrismaArticleToDomain(article)
    );

    // Créer les métadonnées de pagination
    const pagination = createPaginationMeta(page, limit, totalItems);

    return {
      data,
      pagination,
    };
  }

  async findByAuthor(
    authorId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Article>> {
    const {
      page = 1,
      limit = 10,
      searchTerm,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const where: any = {
      authorId,
    };

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Exécuter la requête avec count pour obtenir le nombre total d'articles
    const [articles, totalItems] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    // Mapper les résultats
    const data = articles.map((article) =>
      this.mapPrismaArticleToDomain(article)
    );

    // Créer les métadonnées de pagination
    const pagination = createPaginationMeta(page, limit, totalItems);

    return {
      data,
      pagination,
    };
  }

  async findByTag(
    tag: string,
    options: PaginationOptions & { onlyPublished?: boolean }
  ): Promise<PaginatedResult<Article>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      onlyPublished = false,
    } = options;

    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const where: any = {
      tags: {
        has: tag,
      },
    };

    if (onlyPublished) {
      where.published = true;
    }

    // Exécuter la requête avec count pour obtenir le nombre total d'articles
    const [articles, totalItems] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    // Mapper les résultats
    const data = articles.map((article) =>
      this.mapPrismaArticleToDomain(article)
    );

    // Créer les métadonnées de pagination
    const pagination = createPaginationMeta(page, limit, totalItems);

    return {
      data,
      pagination,
    };
  }

  async findLatest(limit: number): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => this.mapPrismaArticleToDomain(article));
  }

  async create(
    article: Omit<Article, "id" | "createdAt" | "updatedAt" | "likes" | "views">
  ): Promise<Article> {
    const createdArticle = await this.prisma.article.create({
      data: {
        title: article.title,
        description: article.description,
        content: article.content,
        image: article.image,
        published: article.published,
        publishedAt: article.publishedAt,
        links: article.links as any,
        likes: 0,
        views: 0,
        authorId: article.authorId,
        tags: article.tags || [],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return this.mapPrismaArticleToDomain(createdArticle);
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        image: data.image,
        published: data.published,
        publishedAt: data.publishedAt,
        links: data.links as any,
        tags: data.tags,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return this.mapPrismaArticleToDomain(updatedArticle);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.article.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      return false;
    }
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.article.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async incrementLikes(id: string): Promise<void> {
    await this.prisma.article.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }

  async count(onlyPublished: boolean = false): Promise<number> {
    const where = onlyPublished ? { published: true } : {};
    return this.prisma.article.count({ where });
  }

  /**
   * Convertit un article Prisma en entité de domaine
   */
  private mapPrismaArticleToDomain(prismaArticle: any): Article {
    return {
      id: prismaArticle.id,
      title: prismaArticle.title,
      description: prismaArticle.description,
      content: prismaArticle.content,
      image: prismaArticle.image,
      published: prismaArticle.published,
      publishedAt: prismaArticle.publishedAt,
      links: prismaArticle.links as ArticleLinks,
      likes: prismaArticle.likes,
      views: prismaArticle.views,
      authorId: prismaArticle.authorId,
      author: prismaArticle.author,
      comments: prismaArticle.comments,
      tags: prismaArticle.tags || [],
      createdAt: prismaArticle.createdAt,
      updatedAt: prismaArticle.updatedAt,
    };
  }
}
