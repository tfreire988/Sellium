import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireEnv } from "@/lib/server/env";
import { getServiceClient } from "@/lib/server/supabase";

export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook  — sellium-brief-desarrollo.md §4
 *
 * Handles plan changes and one-off report payments. The signature is verified
 * against the raw request body using STRIPE_WEBHOOK_SECRET, so this route must
 * read `req.text()` (not req.json()) to keep the bytes intact.
 */

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  const db = getServiceClient();
  void db; // used by the handlers below once implemented

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: one-off report purchase → set profiles.plan = 'informe_unico'
      //       (or unlock the specific report), keyed by client_reference_id.
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      // TODO: gestoría subscription active → profiles.plan = 'gestoria_mensual'.
      break;
    case "customer.subscription.deleted":
      // TODO: subscription ended → downgrade profiles.plan.
      break;
    default:
      // Unhandled event types are acknowledged so Stripe stops retrying.
      break;
  }

  // Always 200 on a validly-signed event so Stripe doesn't retry indefinitely,
  // even while the individual handlers are still being built out.
  return NextResponse.json({ received: true, type: event.type });
}
