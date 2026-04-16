import "server-only";

import { MongoClient } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function normalizeMongoConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return new Error("Failed to connect to MongoDB.");
  }

  const isSrvLookupIssue =
    /_mongodb\._tcp\./i.test(error.message) &&
    /(ETIMEOUT|ENOTFOUND|ESERVFAIL|querySrv)/i.test(error.message);

  if (!isSrvLookupIssue) {
    return error;
  }

  return new Error(
    "MongoDB Atlas SRV lookup failed on this machine. Check your DNS/network access, make sure Atlas allows your IP, or use Atlas's standard non-SRV connection string locally.",
    { cause: error }
  );
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
    })
      .connect()
      .catch((error) => {
        global.__mongoClientPromise__ = undefined;
        throw normalizeMongoConnectionError(error);
      });
  }

  return global.__mongoClientPromise__;
}

export async function getDatabase() {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db();
}
