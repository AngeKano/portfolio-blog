// src/app/api/articles/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '../../../../../infrastructure/db/prisma/client';
import { PrismaArticleRepository } from '../../../../../infrastructure/db/prisma/repositories/PrismaArticleRepository';
import { GetArticleUseCase } from '../../../../../application/useCases/article/GetArticleUseCase';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';


// Schéma de validation pour la création d'un commentaire
const createCommentSchema = z.object({
  content: z.string().min(3, 'Le commentaire doit contenir au moins 3 caractères'),
  name: z.string().optional(),
});

// GET /api/articles/[id]/comments - Récupérer les commentaires d'un article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Initialiser le repository et le cas d'utilisation
    const articleRepository = new PrismaArticleRepository(prisma);
    const getArticleUseCase = new GetArticleUseCase(articleRepository);
    
    // Récupérer l'article avec ses commentaires
    const article = await getArticleUseCase.executeWithComments(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article.comments || []);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des commentaires' },
      { status: 500 }
    );
  }
}

// POST /api/articles/[id]/comments - Ajouter un commentaire à un article
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
        { error: 'Impossible de commenter un article non publié' },
        { status: 400 }
      );
    }
    
    // Parser et valider le corps de la requête
    const body = await request.json();
    const validationResult = createCommentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { content, name } = validationResult.data;
    
    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content,
        email: session.user.email || '',
        name: name || session.user.name || undefined,
        articleId: id,
      },
    });
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création du commentaire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du commentaire' },
      { status: 500 }
    );
  }
}