// src/app/api/articles/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../../infrastructure/db/prisma/client';
import { PrismaArticleRepository } from '../../../../../infrastructure/db/prisma/repositories/PrismaArticleRepository';
import { GetArticleUseCase } from '../../../../../application/useCases/article/GetArticleUseCase';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { AnalyticsService } from '../../../../../infrastructure/services/analytics/AnalyticsService';

// POST /api/articles/[id]/like - Ajouter un like à un article
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier que l'utilisateur est authentifié
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    // Vérifier que l'article existe
    const articleRepository = new PrismaArticleRepository(prisma);
    const getArticleUseCase = new GetArticleUseCase(articleRepository);
    const article = await getArticleUseCase.execute(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'article est publié
    if (!article.published) {
      return NextResponse.json(
        { error: 'Impossible de liker un article non publié' },
        { status: 400 }
      );
    }
    
    // Incrémenter le compteur de likes
    const analyticsService = new AnalyticsService();
    await analyticsService.trackArticleLike(id);
    
    return NextResponse.json(
      { message: 'Like ajouté avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du like:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'ajout du like' },
      { status: 500 }
    );
  }
}