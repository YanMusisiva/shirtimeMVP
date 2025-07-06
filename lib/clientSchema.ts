import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const allowedCountries = ['BI', 'CD', 'UG'];

export const isValidAllowedCountryNumber = (phoneNumber: string): boolean => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  if (!parsedNumber) return false;
  return parsedNumber.isValid() && allowedCountries.includes(parsedNumber.country as string);
};

export const clientSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  nameProduct: z.string().min(1, { message: "Nom d'élément manquant" }),
  numero: z.string().refine(
    isValidAllowedCountryNumber,
    { message: "Numéro de téléphone invalide ou pays non autorisé (BI, CD, UG)" }
  ),
});

export type ClientData = z.infer<typeof clientSchema>;