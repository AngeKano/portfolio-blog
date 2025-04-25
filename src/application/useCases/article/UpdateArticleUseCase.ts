// src/application/useCases/article/UpdateArticleUseCase.ts

import { UpdateArticleDTO } from "@/application/dtos/ArticleDTO";
import { Article } from "@/domain/entities/Article";
import { ArticleRepository } from "@/domain/repositories/ArticleRepository";

export class UpdateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string, data: UpdateArticleDTO, currentUserId: string): Promise<Article> {
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
      throw new Error('Vous n\'êtes pas autorisé à modifier cet article');
    }
    
    // Préparer les données de mise à jour
    const updateData: Partial<Article> = {};
    
    if (data.title !== undefined) {
      if (!data.title.trim()) {
        throw new Error('Le titre ne peut pas être vide');
      }
      updateData.title = data.title.trim();
    }
    
    if (data.description !== undefined) {
      if (!data.description.trim()) {
        throw new Error('La description ne peut pas être vide');
      }
      updateData.description = data.description.trim();
    }
    
    if (data.content !== undefined) {
      if (!data.content.trim()) {
        throw new Error('Le contenu ne peut pas être vide');
      }
      updateData.content = data.content.trim();
    }
    
    if (data.image !== undefined) {
      updateData.image = data.image;
    }
    
    if (data.links !== undefined) {
      updateData.links = data.links;
    }
    
    if (data.tags !== undefined) {
      updateData.tags = data.tags;
    }
    
    // Gestion spéciale pour la publication
    if (data.published !== undefined && data.published !== article.published) {
      updateData.published = data.published;
      
      // Si l'article est publié pour la première fois, définir la date de publication
      if (data.published && !article.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    
    // Mise à jour de l'article
    const updatedArticle = await this.articleRepository.update(id, updateData);
    
    return updatedArticle;
  }
}