import "server-only";

import { MongoClient } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!global.__mongoClientPromise__) {
    global.__mongoClientPromise__ = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false,
    }).connect();
  }

  return global.__mongoClientPromise__;
}

export async function getDatabase() {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db();
}
