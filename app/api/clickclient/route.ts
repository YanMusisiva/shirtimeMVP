import { NextRequest, NextResponse } from "next/server";
import ClickClient from "../../../models/ClickClient";
import dbConnect from "../../../utils/db";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getEmailContent } from "../../../lib/emailTemplate";
import { notifyTelegram } from "../../../lib/notifyTelegram";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const allowedCountries = ['BI', 'CD', 'UG'];

const isValidAllowedCountryNumber = (phoneNumber: string): boolean => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  if (!parsedNumber) return false;
  return parsedNumber.isValid() && allowedCountries.includes(parsedNumber.country as string);
};

const clientSchema = z.object({
  email: z.string().email(),
  nameProduct: z.string().min(1),
  numero: z.string().refine(
    isValidAllowedCountryNumber,
    { message: "Numéro de téléphone invalide ou pays non autorisé (BI, CD, UG)" }
  ),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid data", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { email, nameProduct, numero } = parsed.data;

    // Enregistrement dans MongoDB
    const client = new ClickClient({ email, nameProduct, numero });
    await client.save();

    // Notification Telegram
    await notifyTelegram(`📩 *Nouveau commande client*:
    *Email:* ${email}
    *Element:* ${nameProduct}
    *Numero:* ${numero}
    *Date:* ${new Date().toLocaleString()}`);

    // Email selon l'élément cliqué
   const { subject, html } = getEmailContent(nameProduct);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SHIRTIME" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

     return NextResponse.json({ message: "client enregistré et email envoyé." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic"; // Pour éviter le cache
export const revalidate = 0; // Pas de revalidation pour cette route