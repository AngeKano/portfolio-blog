// src/domain/entities/Comment.ts
export interface Comment {
    id: string;
    content: string;
    email: string;
    name?: string;
    createdAt: Date;
    articleId?: string;
    projectId?: string;
  }
  
  // Factory function to create a new comment
  export function createComment(
    id: string,
    content: string,
    email: string,
    options?: {
      name?: string;
      articleId?: string;
      projectId?: string;
    }
  ): Comment {
    return {
      id,
      content,
      email,
      name: options?.name,
      articleId: options?.articleId,
      projectId: options?.projectId,
      createdAt: new Date(),
    };
  }