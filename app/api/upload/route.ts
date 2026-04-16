import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

  const data = await res.json() as { secure_url: string; resource_type: string; format: string };

  let type: "image" | "video" | "pdf" = "image";
  if (data.resource_type === "video") type = "video";
  else if (data.format === "pdf") type = "pdf";

  return NextResponse.json({ url: data.secure_url, type });
}
