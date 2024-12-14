import { NextRequest } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    // Create Checkout Sessions from body params.
    const priceId = req.nextUrl.searchParams.get("price_id");
    const quantity = req.nextUrl.searchParams.get("quantity") || 1;
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
          quantity: quantity,
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
  } catch (err: any) {
    return new Response(err.message, { status: err.statusCode || 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.nextUrl.searchParams.get("session_id")
    );

    return new Response(
      JSON.stringify({
        status: session.status,
        customer_email: session.customer_details.email,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(err.message, { status: err.statusCode || 500 });
  }
}
