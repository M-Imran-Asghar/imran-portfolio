"use client";

export type UploadedAsset = {
  url: string;
  type: "image" | "video" | "pdf";
};

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024;

function inferAssetType(file: File): UploadedAsset["type"] {
  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "image";
}

function validateFile(file: File) {
  if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("PDF files must be 5 MB or smaller.");
  }
}

async function getUploadConfig() {
  const res = await fetch("/api/upload", { method: "GET", cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as {
    cloudName?: string;
    uploadPreset?: string;
    error?: string;
  };

  if (!res.ok || !data.cloudName || !data.uploadPreset) {
    throw new Error(data.error ?? "Upload configuration is missing.");
  }

  return {
    cloudName: data.cloudName,
    uploadPreset: data.uploadPreset,
  };
}

export async function uploadAssetFromBrowser(file: File): Promise<UploadedAsset> {
  validateFile(file);

  const { cloudName, uploadPreset } = await getUploadConfig();
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const type = inferAssetType(file);
  const resourceType = type === "pdf" ? "raw" : "auto";
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: form,
  });

  const data = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    resource_type?: string;
    error?: { message?: string };
  };

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? "Upload failed.");
  }

  const resolvedType =
    type === "pdf" ? "pdf" : data.resource_type === "video" ? "video" : "image";

  return {
    url: data.secure_url,
    type: resolvedType,
  };
}
