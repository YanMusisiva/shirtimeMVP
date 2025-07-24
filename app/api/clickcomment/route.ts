import { NextRequest, NextResponse } from "next/server";
import { notifyTelegram } from "../../../lib/notifyTelegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.comment) {
      return NextResponse.json(
        { message: "Missing name or comment" },
        { status: 400 }
      );
    }
    const { name, comment } = body;

    // Notification Telegram
    await notifyTelegram(`📩 *Nouveau commentaire*:
    *Name:* ${name}
    *Comment:* ${comment}
    *Date:* ${new Date().toLocaleString()}`);
    return NextResponse.json(
      { message: "Comment submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic"; // Pour éviter le cache
export const revalidate = 0; // Pas de revalidation pour cette route
