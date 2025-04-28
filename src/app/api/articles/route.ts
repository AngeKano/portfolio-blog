// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "../../../infrastructure/db/prisma/client";
import { PrismaArticleRepository } from "../../../infrastructure/db/prisma/repositories/PrismaArticleRepository";
import { CreateArticleUseCase } from "../../../application/useCases/article/CreateArticleUseCase";
import { ListArticlesUseCase } from "../../../application/useCases/article/ListArticlesUseCase";
import { authOptions } from "../auth/[...nextauth]/auth.config";

// Schéma de validation pour la création d'un article
const createArticleSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),
  image: z.string().url().optional(),
  published: z.boolean().optional(),
  links: z.record(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
});

// Schéma de validation pour les paramètres de requête de liste
const listArticlesSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  tag: z.string().optional(),
  onlyPublished: z.coerce.boolean().optional(),
});

// GET /api/articles - Récupérer la liste des articles
export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de requête
    const url = new URL(request.url);
    const queryParams = {
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
      search: url.searchParams.get("search"),
      sortBy: url.searchParams.get("sortBy"),
      sortOrder: url.searchParams.get("sortOrder"),
      tag: url.searchParams.get("tag"),
      onlyPublished: url.searchParams.get("onlyPublished"),
    };

    // Valider les paramètres
    const validationResult = listArticlesSchema.safeParse({
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
      tag: queryParams.tag,
      onlyPublished: queryParams.onlyPublished || "true", // Par défaut, on renvoie seulement les articles publiés
    });

    if (!validationResult.success) {
      console.log("qsdqsd qsdqsd");
      return NextResponse.json(
        {
          error: "Paramètres de requête invalides",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      tag,
      onlyPublished = true,
    } = validationResult.data;

    // Initialiser le repository et le cas d'utilisation
    const articleRepository = new PrismaArticleRepository(prisma);
    console.log("articleRepository__", articleRepository);
    const listArticlesUseCase = new ListArticlesUseCase(articleRepository);

    let result;

    // Si un tag est spécifié, on récupère les articles par tag
    if (tag) {
      result = await listArticlesUseCase.executeByTag(tag, {
        page,
        limit,
        sortBy,
        sortOrder,
      });
    } else {
      // Sinon, on récupère tous les articles
      result = await listArticlesUseCase.execute(
        {
          page,
          limit,
          searchTerm: search,
          sortBy,
          sortOrder,
        },
        onlyPublished
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

// POST /api/articles - Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
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
    const validationResult = createArticleSchema.safeParse(body);

    if (!validationResult.success) {
      console.log("qsdqsd qsdqsd");

      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const articleData = validationResult.data;

    // Initialiser le repository et le cas d'utilisation
    const articleRepository = new PrismaArticleRepository(prisma);
    const createArticleUseCase = new CreateArticleUseCase(articleRepository);

    // Créer l'article
    const article = await createArticleUseCase.execute(
      articleData,
      session.user.id
    );

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création de l'article:", error);

    if (
      error.message === "Le titre est obligatoire" ||
      error.message === "La description est obligatoire" ||
      error.message === "Le contenu est obligatoire" ||
      error.message === "L'auteur est obligatoire"
    ) {

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de l'article" },
      { status: 500 }
    );
  }
}
