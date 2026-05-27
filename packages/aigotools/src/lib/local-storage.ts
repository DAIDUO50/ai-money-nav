"use server";
import { v4 } from "uuid";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

import { AppConfig } from "./config";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadBufferToLocal(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  ensureUploadDir();
  const subfix = contentType.split("/").pop();
  const fileKey = subfix ? `${v4()}.${subfix}` : `${v4()}.webp`;

  const filePath = join(UPLOAD_DIR, fileKey);
  writeFileSync(filePath, buffer);

  return `/uploads/${fileKey}`;
}

export async function uploadFormDataToLocal(formData: FormData) {
  const files = formData.getAll("files") as File[];

  const uploadRes = await Promise.all(
    files.map(async (file) => {
      const buffer = await sharp(await file.arrayBuffer())
        .toFormat("webp")
        .toBuffer();

      return uploadBufferToLocal(buffer, "image/webp");
    })
  );

  return uploadRes;
}
