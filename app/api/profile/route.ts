import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export type ProfileDocument = {
  name: string;
  avatar: string;
  socials: { twitter: string; facebook: string; instagram: string; skype: string; linkedin: string };
};

const PROFILE_ID = "main";

async function getCollection() {
  const db = await getDatabase();
  return db.collection<ProfileDocument & { _id: string }>("profile");
}

export async function GET() {
  try {
    const col = await getCollection();
    const doc = await col.findOne({ _id: PROFILE_ID } as never);
    return NextResponse.json(doc ?? {});
  } catch {
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ProfileDocument>;

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const col = await getCollection();
    await col.updateOne(
      { _id: PROFILE_ID } as never,
      { $set: { ...body, _id: PROFILE_ID } } as never,
      { upsert: true }
    );

    const updated = await col.findOne({ _id: PROFILE_ID } as never);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }
}
