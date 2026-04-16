import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024;

function getUploadConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary upload settings are not configured.");
  }

  return { cloudName, uploadPreset };
}

export async function GET() {
  try {
    const { cloudName, uploadPreset } = getUploadConfig();
    return NextResponse.json({ cloudName, uploadPreset });
  } catch (error) {
    console.error("Upload config failed:", error);
    return NextResponse.json({ error: "Upload configuration is missing." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE_BYTES) {
    return NextResponse.json({ error: "PDF files must be 5 MB or smaller." }, { status: 400 });
  }

  const { cloudName, uploadPreset } = getUploadConfig();

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const isPdf = file.type === "application/pdf";
  const resourceType = isPdf ? "raw" : "auto";

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    console.error("Cloudinary error:", err);
    return NextResponse.json({ error: err?.error?.message ?? "Upload failed" }, { status: 500 });
  }

  const data = await res.json() as { secure_url: string; resource_type: string; format: string };

  let type: "image" | "video" | "pdf" = "image";
  if (isPdf) type = "pdf";
  else if (data.resource_type === "video") type = "video";

  return NextResponse.json({ url: data.secure_url, type });
}
