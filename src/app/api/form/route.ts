// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { AllFormValues } from "@/lib/utils";
import Stripe from "stripe";

import { insertRegistration } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET() {
  if (!stripe) {
    return new Response(JSON.stringify({ error: "Stripe not loaded" }), {
      status: 500,
    });
  }
  try {
    const products = await stripe.products.list({
      active: true,
    });
    const prices = await stripe.prices.list({
      active: true,
    });

    // join the products and prices
    const productsWithPrices = products.data.map((product: Stripe.Product) => ({
      ...product,
      ...product.metadata,
      weekPriceId: product.metadata.default_price,
      isActive: true,
      prices: prices.data.filter(
        (price: Stripe.Price) => price.product === product.id
      ),
    }));
    return new Response(
      JSON.stringify(
        productsWithPrices.map((product: Stripe.Product) => ({
          ...product,
          ...product.metadata,
          weekPriceId: product.default_price,
          isActive: true,
        }))
      )
    );
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const values = (await req.json()) as AllFormValues;

  const id = await insertRegistration(values);

  return new Response(JSON.stringify({ id }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
