import "server-only";
import fs from "fs";
import path from "path";
import { SiteContent, defaultContent, mergeSiteContent } from "./data";

const filePath = path.join(process.cwd(), "content.json");

export function readContent(): SiteContent {
  if (!fs.existsSync(filePath)) return defaultContent;
  try {
    return mergeSiteContent(JSON.parse(fs.readFileSync(filePath, "utf-8")) as Partial<SiteContent>);
  } catch {
    return defaultContent;
  }
}

export function writeContent(data: SiteContent): void {
  fs.writeFileSync(filePath, JSON.stringify(mergeSiteContent(data), null, 2), "utf-8");
}
