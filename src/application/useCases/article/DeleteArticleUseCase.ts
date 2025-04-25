// src/application/useCases/article/DeleteArticleUseCase.ts
// import { ArticleRepository } from '../../../domain/repositories/ArticleRepository';

import { ArticleRepository } from "@/domain/repositories/ArticleRepository";

export class DeleteArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string, currentUserId: string): Promise<boolean> {
    // Valider l'ID
    if (!id) {
      throw new Error('L\'identifiant de l\'article est obligatoire');
    }
    
    // Vérifier que l'article existe
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error('Article non trouvé');
    }
    
    // Vérifier que l'utilisateur est l'auteur de l'article
    if (article.authorId !== currentUserId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer cet article');
    }
    
    // Supprimer l'article
    const result = await this.articleRepository.delete(id);
    
    return result;
  }
}