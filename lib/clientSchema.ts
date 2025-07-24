import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// On accepte tous les pays, on vérifie seulement la validité du numéro
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  return !!parsedNumber && parsedNumber.isValid();
};

export const clientSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  nameProduct: z.string().min(1, { message: "Nom d'élément manquant" }),
  numero: z
    .string()
    .refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide" }),
});

export type ClientData = z.infer<typeof clientSchema>;
