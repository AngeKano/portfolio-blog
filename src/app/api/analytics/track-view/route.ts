// app/api/analytics/track-view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AnalyticsService } from "../../../../infrastructure/services/analytics/AnalyticsService";

// Schéma de validation
const trackViewSchema = z.object({
  id: z.string().min(1, "ID est obligatoire"),
  type: z.enum(["article", "project"], {
    errorMap: () => ({ message: "Type doit être 'article' ou 'project'" }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = trackViewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { id, type } = validationResult.data;
    const analyticsService = new AnalyticsService();

    // Suivre la vue en fonction du type
    if (type === "article") {
      await analyticsService.trackArticleView(id);
    } else if (type === "project") {
      await analyticsService.trackProjectView(id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du suivi de vue:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du suivi de vue" },
      { status: 500 }
    );
  }
}
