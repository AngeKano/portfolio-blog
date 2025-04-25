// src/application/useCases/article/CreateArticleUseCase.ts
import { CreateArticleDTO } from "@/application/dtos/ArticleDTO";
import { Article } from "@/domain/entities/Article";
import { ArticleRepository } from "@/domain/repositories/ArticleRepository";

/**
 * L'implementation concrete des repository cree dans le dommain
 * le dommain c'est le noyau de tous il defini les type en bd et les fonction a utiliser sur celle ci tous en precisant les type attendu 
 */
export class CreateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(data: CreateArticleDTO, authorId: string): Promise<Article> {
    // Validation des données
    if (!data.title || !data.title.trim()) {
      throw new Error("Le titre est obligatoire");
    }

    if (!data.description || !data.description.trim()) {
      throw new Error("La description est obligatoire");
    }

    if (!data.content || !data.content.trim()) {
      throw new Error("Le contenu est obligatoire");
    }

    if (!authorId) {
      throw new Error("L'auteur est obligatoire");
    }

    // Créer l'article
    const article = await this.articleRepository.create({
      title: data.title.trim(),
      description: data.description.trim(),
      content: data.content.trim(),
      image: data.image,
      published: data.published || false,
      publishedAt: data.published ? new Date() : null,
      links: data.links || null,
      authorId: authorId,
      tags: data.tags || [],
    });

    return article;
  }
}
