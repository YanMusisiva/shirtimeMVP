import { Schema, Document, models, model } from "mongoose";

export interface IClickClient extends Document {
  email: string;
  nameProduct: string;
  numero:string;
  createdAt: Date;
}

const ClickClientSchema = new Schema<IClickClient>(
  {
    email: { type: String, required: true },
    nameProduct: { type: String, required: true },
    numero: { type: String, required: true }
  },
  { timestamps: true } // ajoute automatiquement createdAt et updatedAt
);

// Pour éviter le modèle déjà compilé lors de l'utilisation avec Next.js
export default models.ClickClient || model<IClickClient>("ClickClient", ClickClientSchema);