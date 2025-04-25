// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "../../../../infrastructure/db/prisma/client";
import { PrismaArticleRepository } from "../../../../infrastructure/db/prisma/repositories/PrismaArticleRepository";
import { GetArticleUseCase } from "../../../../application/useCases/article/GetArticleUseCase";
import { UpdateArticleUseCase } from "../../../../application/useCases/article/UpdateArticleUseCase";
import { DeleteArticleUseCase } from "../../../../application/useCases/article/DeleteArticleUseCase";
import { authOptions } from "../../auth/[...nextauth]/route";
import { AnalyticsService } from "../../../../infrastructure/services/analytics/AnalyticsService";

// Schéma de validation pour la mise à jour d'un article
const updateArticleSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .optional(),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .optional(),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères")
    .optional(),
  image: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
  links: z.record(z.string().url()).nullable().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/articles/[id] - Récupérer un article par son ID
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
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues si l'article est publié
    if (article.published) {
      const analyticsService = new AnalyticsService();
      await analyticsService.trackArticleView(id);
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'article:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Mettre à jour un article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Vérifier que l'utilisateur est authentifié
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Parser et valider le corps de la requête
    const body = await request.json();
    const validationResult = updateArticleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const articleData = validationResult.data;

    // Initialiser le repository et le cas d'utilisation
    const articleRepository = new PrismaArticleRepository(prisma);
    const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);

    // Mettre à jour l'article
    const article = await updateArticleUseCase.execute(
      id,
      {
        ...articleData,
        image: articleData.image ?? undefined,
        links: articleData.links ?? undefined,
      },
      session.user.id
    );

    return NextResponse.json(article);
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'article:", error);

    if (error.message === "Article non trouvé") {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    if (error.message === "Vous n'êtes pas autorisé à modifier cet article") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cet article" },
        { status: 403 }
      );
    }

    if (
      error.message === "Le titre ne peut pas être vide" ||
      error.message === "La description ne peut pas être vide" ||
      error.message === "Le contenu ne peut pas être vide"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Supprimer un article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Vérifier que l'utilisateur est authentifié
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Initialiser le repository et le cas d'utilisation
    const articleRepository = new PrismaArticleRepository(prisma);
    const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

    // Supprimer l'article
    const success = await deleteArticleUseCase.execute(id, session.user.id);

    if (!success) {
      return NextResponse.json(
        {
          error: "Une erreur est survenue lors de la suppression de l'article",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Article supprimé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'article:", error);

    if (error.message === "Article non trouvé") {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    if (error.message === "Vous n'êtes pas autorisé à supprimer cet article") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cet article" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}
