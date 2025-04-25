// infrastructure/services/analytics/AnalyticsService.ts
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../db/prisma/client';

export class AnalyticsService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  /**
   * Enregistre une vue pour un article
   */
  async trackArticleView(articleId: string): Promise<void> {
    await this.prisma.article.update({
      where: { id: articleId },
      data: { 
        views: { increment: 1 }
      }
    });
  }

  /**
   * Enregistre une vue pour un projet
   */
  async trackProjectView(projectId: string): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        views: { increment: 1 }
      }
    });
  }

  /**
   * Enregistre un like pour un article
   */
  async trackArticleLike(articleId: string): Promise<void> {
    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        likes: { increment: 1 }
      }
    });
  }

  /**
   * Enregistre un like pour un projet
   */
  async trackProjectLike(projectId: string): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        likes: { increment: 1 }
      }
    });
  }

  /**
   * Obtient les statistiques générales du site
   */
  async getSiteStats() {
    const [
      articlesCount,
      projectsCount,
      visitorsCount,
      commentsCount,
      totalViews,
      totalLikes
    ] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.project.count(),
      this.prisma.visitor.count(),
      this.prisma.comment.count(),
      this.getTotalViews(),
      this.getTotalLikes()
    ]);

    return {
      articlesCount,
      projectsCount,
      visitorsCount,
      commentsCount,
      totalViews,
      totalLikes
    };
  }

  /**
   * Obtient le nombre total de vues sur tous les articles et projets
   */
  private async getTotalViews(): Promise<number> {
    const articlesViews = await this.prisma.article.aggregate({
      _sum: { views: true }
    });

    const projectsViews = await this.prisma.project.aggregate({
      _sum: { views: true }
    });

    return (articlesViews._sum.views || 0) + (projectsViews._sum.views || 0);
  }

  /**
   * Obtient le nombre total de likes sur tous les articles et projets
   */
  private async getTotalLikes(): Promise<number> {
    const articlesLikes = await this.prisma.article.aggregate({
      _sum: { likes: true }
    });

    const projectsLikes = await this.prisma.project.aggregate({
      _sum: { likes: true }
    });

    return (articlesLikes._sum.likes || 0) + (projectsLikes._sum.likes || 0);
  }

  /**
   * Obtient les articles les plus vus
   */
  async getMostViewedArticles(limit: number = 5) {
    return this.prisma.article.findMany({
      orderBy: { views: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        publishedAt: true
      }
    });
  }

  /**
   * Obtient les projets les plus vus
   */
  async getMostViewedProjects(limit: number = 5) {
    return this.prisma.project.findMany({
      orderBy: { views: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        startDate: true,
        endDate: true
      }
    });
  }
}