import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@raysstream/db";

const SESSION_COOKIE = "raysstream_session";

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });

  return user;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  creator?: boolean;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const slugBase = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-channel`;

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.creator ? "CREATOR" : "VIEWER",
      channel: input.creator
        ? {
            create: {
              name: `${input.name} Channel`,
              slug: slugBase
            }
          }
        : undefined
    }
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  cookieStore.delete(SESSION_COOKIE);
}
