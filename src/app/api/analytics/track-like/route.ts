// app/api/analytics/track-like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AnalyticsService } from "../../../../infrastructure/services/analytics/AnalyticsService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth.config";

// Schéma de validation
const trackLikeSchema = z.object({
  id: z.string().min(1, "ID est obligatoire"),
  type: z.enum(["article", "project"], {
    errorMap: () => ({ message: "Type doit être 'article' ou 'project'" }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Valider les données
    const body = await request.json();
    const validationResult = trackLikeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { id, type } = validationResult.data;
    const analyticsService = new AnalyticsService();

    // Suivre le like en fonction du type
    if (type === "article") {
      await analyticsService.trackArticleLike(id);
    } else if (type === "project") {
      await analyticsService.trackProjectLike(id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du suivi de like:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du suivi de like" },
      { status: 500 }
    );
  }
}
