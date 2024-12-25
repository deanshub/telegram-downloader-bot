import fs from "fs/promises";
import path from "path";

export async function download(url: string, filename: string) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/octet-stream" },
  });
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(path.join(process.cwd(), "downloads", filename), buffer);
}
