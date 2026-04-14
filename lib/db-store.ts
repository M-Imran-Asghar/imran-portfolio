import "server-only";
import { getDatabase } from "./mongodb";
import { emptyContent, mergeSiteContent, SiteContent } from "./data";

const CONTENT_ID = "main";

async function getCollection() {
  const db = await getDatabase();
  return db.collection("site_content");
}

export async function readContentFromDb(): Promise<SiteContent> {
  try {
    const col = await getCollection();
    const doc = await col.findOne({ _id: CONTENT_ID } as never) as Record<string, unknown> | null;
    if (!doc) return emptyContent;
    const { _id, ...rest } = doc;
    void _id;
    return mergeSiteContent(rest as Partial<SiteContent>);
  } catch {
    return emptyContent;
  }
}

export async function writeContentToDb(data: SiteContent): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { _id: CONTENT_ID } as never,
    { $set: { ...mergeSiteContent(data), _id: CONTENT_ID } } as never,
    { upsert: true }
  );
}
