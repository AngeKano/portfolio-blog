// app/api/auth/visitor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/db/prisma/client";
import { RegisterUserUseCase } from "@/application/useCases/user/RegisterUserUseCase";
import { PrismaUserRepository } from "@/infrastructure/db/prisma/repositories/PrismaUserRepository";

// Schéma de validation
const visitorSchema = z.object({
  email: z.string().email("Format d'email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    // Parser et valider le corps de la requête
    const body = await request.json();
    const validationResult = visitorSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Initialiser le repository et le cas d'utilisation
    const userRepository = new PrismaUserRepository(prisma);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    // Enregistrer un nouveau visiteur
    await registerUserUseCase.registerVisitor(email);

    // Retourner un succès
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du visiteur:", error);

    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement du visiteur" },
      { status: 500 }
    );
  }
}
