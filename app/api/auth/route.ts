import { NextResponse } from "next/server";
import { findAdminByEmail, updateAdminLastLogin, verifyPassword } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const admin = await findAdminByEmail(email);

    if (!admin || !admin.isActive || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await updateAdminLastLogin(admin.email);

    const res = NextResponse.json({ ok: true, email: admin.email, role: admin.role });
    res.cookies.set("admin_auth", "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 8 });
    return res;
  } catch {
    return NextResponse.json({ error: "Unable to log in right now." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_auth");
  return res;
}
