import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password, name, creator } = await req.json();

  try {
    const user = await registerUser({ email, password, name, creator });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 });
  }
}
