import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // ⚠️ Vérifie que ce chemin vers ton fichier config firebase est exact !
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const categoriesRef = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesRef);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // On renvoie les catégories trouvées
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur critique dans /api/categories :", error);

    // 🔥 Sécurité : Au lieu de renvoyer une erreur 500 qui fait planter le site,
    // on renvoie un tableau vide [] avec un statut 200. Le site ne plantera plus !
    return NextResponse.json([], { status: 200 });
  }
}
