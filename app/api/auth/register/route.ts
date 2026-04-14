import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { createAdmin, isValidEmail } from "@/lib/admin-auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };

  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const account = await createAdmin(email, password);
    const res = NextResponse.json(
      {
        ok: true,
        user: account,
      },
      { status: 201 }
    );
    res.cookies.set("admin_auth", "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 8 });
    return res;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    console.error("Register API failed:", error);

    return NextResponse.json(
      {
        error: "Unable to register right now.",
        ...(process.env.NODE_ENV !== "production" && error instanceof Error ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}
