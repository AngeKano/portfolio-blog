// src/domain/repositories/ArticleRepository.ts
import {
  PaginatedResult,
  PaginationOptions,
} from "@/application/dtos/PaginationDTO";
import { Article } from "../entities/Article";

/**
 * Interface pour implementer les ffunction de notre projet
 * Avec les typa attendu Juste ca
 */

export interface ArticleRepository {
  /**
   * Trouve un article par son identifiant
   */
  findById(id: string): Promise<Article | null>;

  /**
   * Trouve un article avec ses commentaires par son identifiant
   */
  findByIdWithComments(id: string): Promise<Article | null>;

  /**
   * Récupère tous les articles avec pagination
   */
  findAll(
    options: PaginationOptions & { onlyPublished?: boolean }
  ): Promise<PaginatedResult<Article>>;

  /**
   * Récupère les articles d'un auteur spécifique
   */
  findByAuthor(
    authorId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Article>>;

  /**
   * Récupère les articles par tag
   */
  findByTag(
    tag: string,
    options: PaginationOptions & { onlyPublished?: boolean }
  ): Promise<PaginatedResult<Article>>;

  /**
   * Récupère les derniers articles publiés
   */
  findLatest(limit: number): Promise<Article[]>;

  /**
   * Crée un nouvel article
   */
  create(
    article: Omit<Article, "id" | "createdAt" | "updatedAt" | "likes" | "views">
  ): Promise<Article>;

  /**
   * Met à jour un article existant
   */
  update(id: string, data: Partial<Article>): Promise<Article>;

  /**
   * Supprime un article
   */
  delete(id: string): Promise<boolean>;

  /**
   * Incrémente le compteur de vues d'un article
   */
  incrementViews(id: string): Promise<void>;

  /**
   * Incrémente le compteur de likes d'un article
   */
  incrementLikes(id: string): Promise<void>;

  /**
   * Compte le nombre total d'articles
   */
  count(onlyPublished?: boolean): Promise<number>;
}
