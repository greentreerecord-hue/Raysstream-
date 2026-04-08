import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await signIn(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
}
