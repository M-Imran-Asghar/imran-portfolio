import "server-only";

import { NextResponse } from "next/server";

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const isAtlasSrvLookupIssue =
      /_mongodb\._tcp\./i.test(error.message) &&
      /(ETIMEOUT|ENOTFOUND|ESERVFAIL|querySrv)/i.test(error.message);

    if (isAtlasSrvLookupIssue) {
      return "MongoDB Atlas SRV lookup failed on this machine. Check your DNS/network access, make sure Atlas allows your IP, or use Atlas's standard non-SRV connection string locally.";
    }

    return error.message;
  }

  return "Unknown server error.";
}

export function serverErrorResponse(publicMessage: string, error: unknown, logLabel = publicMessage) {
  console.error(logLabel, error);

  return NextResponse.json(
    {
      error: publicMessage,
      ...(process.env.NODE_ENV !== "production" ? { details: getErrorDetails(error) } : {}),
    },
    { status: 500 }
  );
}
