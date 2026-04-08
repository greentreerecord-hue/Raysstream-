import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PRICE_IDS: Record<string, string> = {
  MOBILE: "price_mobile",
  STANDARD: "price_standard",
  PREMIUM: "price_premium"
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const { plan } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/billing?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=1`,
    customer_email: user.email
  });

  return NextResponse.json({ url: session.url });
}
