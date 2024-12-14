import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  if (!stripe.checkout.sessions) {
    return new Response(JSON.stringify({ error: "Stripe not loaded" }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  try {
    // Create Checkout Sessions from body params.
    const priceId = req.nextUrl.searchParams.get("price_id");
    const quantity = req.nextUrl.searchParams.get("quantity") || "1";
    const coupon = req.nextUrl.searchParams.get("couponCode");
    if (!priceId) {
      throw { statusCode: 400, message: "Price ID is required" };
    }
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: priceId,
          quantity: parseInt(quantity),
        },
      ],
      ...(coupon
        ? { discounts: [{ coupon }] }
        : { allow_promotion_codes: true }),
      mode: "payment",
      return_url: `${req.headers.get(
        "origin"
      )}/submit?session_id={CHECKOUT_SESSION_ID}`,
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret })
    );
  } catch (err: unknown) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.nextUrl.searchParams.get("session_id")!
    );

    return new Response(
      JSON.stringify({
        status: session.status,
        customer_email: session.customer_details?.email,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
