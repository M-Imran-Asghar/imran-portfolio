import { getDatabase } from "@/lib/mongodb";
import { serverErrorResponse } from "@/lib/api-error";
import { NextResponse } from "next/server";

export type HomeDocument = {
  heroName: string;
  heroBg: string;
  heroRoles: string[];
};

const HOME_ID = "main";

async function getCollection() {
  const db = await getDatabase();
  return db.collection("home");
}

function validate(body: Partial<HomeDocument>) {
  if (!body.heroName?.trim()) return "Hero name is required.";
  return null;
}

export async function GET() {
  try {
    const col = await getCollection();
    const doc = await col.findOne({ _id: HOME_ID } as never);
    return NextResponse.json(doc ?? {});
  } catch (error) {
    return serverErrorResponse("Failed to load home.", error, "Home GET failed:");
  }
}

// POST — only allowed when no entry exists yet
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<HomeDocument>;
    const err = validate(body);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const col = await getCollection();
    const existing = await col.findOne({ _id: HOME_ID } as never);
    if (existing) {
      return NextResponse.json({ error: "Home already exists. Use PUT to update." }, { status: 409 });
    }

    await col.insertOne({ _id: HOME_ID, ...body } as never);
    const doc = await col.findOne({ _id: HOME_ID } as never);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    return serverErrorResponse("Failed to create home.", error, "Home POST failed:");
  }
}

// PUT — only allowed when entry already exists
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<HomeDocument>;
    const err = validate(body);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const col = await getCollection();
    const existing = await col.findOne({ _id: HOME_ID } as never);
    if (!existing) {
      return NextResponse.json({ error: "No home entry found. Use POST to create first." }, { status: 404 });
    }

    await col.updateOne({ _id: HOME_ID } as never, { $set: body } as never);
    const doc = await col.findOne({ _id: HOME_ID } as never);
    return NextResponse.json(doc);
  } catch (error) {
    return serverErrorResponse("Failed to update home.", error, "Home PUT failed:");
  }
}
