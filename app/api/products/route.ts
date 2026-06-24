import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ==========================================
// 1. READ : Récupérer tous les produits
// ==========================================
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Erreur GET Firestore:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 2. CREATE : Ajouter un nouveau produit
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      nameEN,
      nameFR,
      descEN,
      descFR,
      detailEN,
      detailFR,
      price,
      img,
      video,
    } = body;

    // Validation rapide côté serveur
    if (!id || !nameEN || !nameFR || !price || !img || !video) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    // Référence du document avec l'ID personnalisé choisi (ex: shirtime-04)
    const productRef = doc(collection(db, "products"), id);

    // Enregistrement des données textuelles et des URLs Cloudinary sur Firestore
    await setDoc(productRef, {
      id,
      nameEN,
      nameFR,
      descEN,
      descFR,
      detailEN,
      detailFR,
      price: parseFloat(String(price)),
      img, // URL sécurisée Cloudinary transmise par le composant client
      video, // URL sécurisée Cloudinary de la vidéo loop
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Produit enregistré avec succès" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur POST Firestore:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. UPDATE : Modifier un produit existant
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "L'ID du produit est requis pour la modification" },
        { status: 400 },
      );
    }

    const productRef = doc(db, "products", id);

    // Mise à jour partielle des champs modifiés (nom, descriptions, prix...)
    await updateDoc(productRef, {
      ...updateData,
      price: parseFloat(String(updateData.price)),
    });

    return NextResponse.json(
      { message: "Produit mis à jour avec succès" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erreur PUT Firestore:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 4. DELETE : Supprimer un produit du catalogue
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "L'ID du produit est requis pour la suppression" },
        { status: 400 },
      );
    }

    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);

    return NextResponse.json(
      { message: "Produit supprimé avec succès de Firestore" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erreur DELETE Firestore:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
