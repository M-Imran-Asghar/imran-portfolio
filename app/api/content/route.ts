import { mergeSiteContent, SiteContent } from "@/lib/data";
import { serverErrorResponse } from "@/lib/api-error";
import { readContentFromDb, writeContentToDb } from "@/lib/db-store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readContentFromDb();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SiteContent>;
    const next = mergeSiteContent(body);
    await writeContentToDb(next);
    return NextResponse.json(next);
  } catch (error) {
    return serverErrorResponse("Failed to save content.", error, "Content POST failed:");
  }
}
