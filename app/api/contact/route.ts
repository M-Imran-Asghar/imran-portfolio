import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ContactMessage>;

    if (!body.name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    if (!body.email?.trim()) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    if (!body.message?.trim()) return NextResponse.json({ error: "Message is required." }, { status: 400 });

    const db = await getDatabase();
    await db.collection("contact_messages").insertOne({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const messages = await db.collection("contact_messages")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}
