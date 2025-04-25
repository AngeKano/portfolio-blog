// src/domain/entities/Article.ts
import { Comment } from './Comment';
import { User } from './User';

export interface ArticleLinks {
  github?: string;
  demo?: string;
  docs?: string;
  [key: string]: string | undefined;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  published: boolean;
  publishedAt?: Date | null;
  links?: ArticleLinks | null;
  likes: number;
  views: number;
  authorId: string;
  author?: User;
  comments?: Comment[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleWithAuthor extends Article {
  author: User;
}

export interface ArticleWithComments extends Article {
  comments: Comment[];
}

export interface ArticleWithAuthorAndComments extends Article {
  author: User;
  comments: Comment[];
}

// Factory function to create a new article
export function createArticle(
  id: string,
  title: string,
  description: string,
  content: string,
  authorId: string,
  options?: {
    image?: string;
    published?: boolean;
    publishedAt?: Date | null;
    links?: ArticleLinks | null;
    likes?: number;
    views?: number;
    tags?: string[];
  }
): Article {
  return {
    id,
    title,
    description,
    content,
    image: options?.image,
    published: options?.published || false,
    publishedAt: options?.publishedAt || null,
    links: options?.links || null,
    likes: options?.likes || 0,
    views: options?.views || 0,
    authorId,
    tags: options?.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}