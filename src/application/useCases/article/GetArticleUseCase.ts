// src/application/useCases/article/GetArticleUseCase.ts
import { Article } from '@/domain/entities/Article';
import { ArticleRepository } from '@/domain/repositories/ArticleRepository';

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article | null> {
    // Valider l'ID
    if (!id) {
      throw new Error('L\'identifiant de l\'article est obligatoire');
    }
    
    // Récupérer l'article
    const article = await this.articleRepository.findById(id);
    
    return article;
  }

  async executeWithComments(id: string): Promise<Article | null> {
    // Valider l'ID
    if (!id) {
      throw new Error('L\'identifiant de l\'article est obligatoire');
    }
    
    // Récupérer l'article avec ses commentaires
    const article = await this.articleRepository.findByIdWithComments(id);
    
    return article;
  }
}
