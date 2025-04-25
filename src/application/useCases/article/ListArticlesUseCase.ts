// src/application/useCases/article/ListArticlesUseCase.ts
import { Article } from '../../../domain/entities/Article';
import { ArticleRepository } from '../../../domain/repositories/ArticleRepository';
import { PaginationOptions, PaginatedResult } from '../../dtos/PaginationDTO';

export class ListArticlesUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(options?: PaginationOptions, onlyPublished: boolean = false): Promise<PaginatedResult<Article>> {
    const { page = 1, limit = 10, searchTerm, sortBy, sortOrder } = options || {};
    
    // Récupérer les articles avec pagination
    const result = await this.articleRepository.findAll({
      page,
      limit,
      searchTerm,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      onlyPublished
    });
    
    return result;
  }

  async executeByAuthor(authorId: string, options?: PaginationOptions): Promise<PaginatedResult<Article>> {
    // Valider l'ID de l'auteur
    if (!authorId) {
      throw new Error('L\'identifiant de l\'auteur est obligatoire');
    }

    const { page = 1, limit = 10, searchTerm, sortBy, sortOrder } = options || {};
    
    // Récupérer les articles de l'auteur avec pagination
    const result = await this.articleRepository.findByAuthor(authorId, {
      page,
      limit,
      searchTerm,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
    
    return result;
  }

  async executeByTag(tag: string, options?: PaginationOptions): Promise<PaginatedResult<Article>> {
    // Valider le tag
    if (!tag) {
      throw new Error('Le tag est obligatoire');
    }

    const { page = 1, limit = 10, sortBy, sortOrder } = options || {};
    
    // Récupérer les articles par tag avec pagination
    const result = await this.articleRepository.findByTag(tag, {
      page,
      limit,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      onlyPublished: true
    });
    
    return result;
  }

  async getLatestArticles(limit: number = 5): Promise<Article[]> {
    // Récupérer les derniers articles publiés
    const articles = await this.articleRepository.findLatest(limit);
    
    return articles;
  }
}