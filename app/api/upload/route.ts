import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `upload_${Date.now()}.${ext}`;
  const dest = path.join(process.cwd(), "public", filename);
  await writeFile(dest, buffer);

  // Detect type
  const mime = file.type;
  let type: "image" | "video" | "pdf" = "image";
  if (mime.startsWith("video/")) type = "video";
  else if (mime === "application/pdf") type = "pdf";

  return NextResponse.json({ url: `/${filename}`, type });
}
