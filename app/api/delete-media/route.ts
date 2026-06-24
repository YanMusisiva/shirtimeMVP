import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 1. Vérifier si le corps de la requête est lisible
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Le corps JSON est invalide ou vide" },
        { status: 400 },
      );
    }

    const { publicId, resourceType } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Le paramètre publicId est manquant" },
        { status: 400 },
      );
    }

    // 2. Déterminer le bon type de ressource pour Cloudinary (image, video, raw)
    const typeOfResource = resourceType === "video" ? "video" : "image";

    console.log(
      `[Cloudinary API] Tentative de suppression de : ${publicId} (${typeOfResource})`,
    );

    // 3. Demande de destruction à Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: typeOfResource,
    });

    console.log("[Cloudinary API] Résultat renvoyé :", result);

    // Si Cloudinary renvoie "not found", c'est que le public_id extrait était incorrect
    if (result.result === "not_found") {
      return NextResponse.json(
        {
          success: false,
          warning: "Fichier introuvable sur Cloudinary",
          result,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    // Cela affichera l'erreur réelle directement dans votre terminal VS Code !
    console.error("[Cloudinary API Error]:", error);

    const msg =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
