// src/application/dtos/ArticleDTO.ts
import { ArticleLinks } from '../../domain/entities/Article';

/** 
 * Les different type utile dans le front
 * Pour tous ce qui sera data a manipuler
*/

/**
 * DTO pour la création d'un article
 */
export interface CreateArticleDTO {
  title: string;
  description: string;
  content: string;
  image?: string;
  published?: boolean;
  links?: ArticleLinks;
  tags?: string[];
}

/**
 * DTO pour la mise à jour d'un article
 */
export interface UpdateArticleDTO {
  title?: string; 
  description?: string;
  content?: string;
  image?: string;
  published?: boolean;
  links?: ArticleLinks;
  tags?: string[];
}


/**
 * DTO pour l'affichage d'un article résumé
 */
export interface ArticleSummaryDTO {
  id: string;
  title: string;
  description: string;
  image?: string;
  publishedAt?: Date | null;
  tags: string[];
  authorName: string;
  authorImage?: string;
}

/**
 * DTO pour l'affichage d'un article complet
 */
export interface ArticleDetailDTO {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  published: boolean;
  publishedAt?: Date | null;
  links?: ArticleLinks;
  likes: number;
  views: number;
  tags: string[];
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: CommentDTO[];
}

/**
 * DTO pour un commentaire d'article
 */
export interface CommentDTO {
  id: string;
  content: string;
  email: string;
  name?: string;
  createdAt: Date;
}

/**
 * DTO pour la création d'un commentaire
 */
export interface CreateCommentDTO {
  content: string;
  email: string;
  name?: string;
  articleId?: string;
  projectId?: string;
}