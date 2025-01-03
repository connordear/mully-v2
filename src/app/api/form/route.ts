// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { AllFormValues } from "@/lib/utils";
import Stripe from "stripe";

import { insertRegistration } from "@/lib/db";
import { Program } from "@/lib/types";

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
      limit: 100,
    });

    // join the products and prices
    const productsWithPrices = products.data.map(
      (product: Stripe.Product) =>
        ({
          ...product,
          ...product.metadata,
          defaultPriceId: product.default_price?.toString(),
          weekPrices: prices.data
            .filter((p) => !p.metadata.isDayPrice && p.product === product.id)
            .map((p) => ({
              id: p.id,
              name: p.metadata.label,
              isDayPrice: Boolean(p.metadata.isDayPrice),
            })),
          dayPrices: prices.data
            .filter((p) => p.metadata.isDayPrice && p.product === product.id)
            .map((p) => ({
              id: p.id,
              name: p.metadata.label,
              isDayPrice: Boolean(p.metadata.isDayPrice),
            })),
          isActive: true,
        } satisfies Partial<Program>)
    );
    return new Response(JSON.stringify(productsWithPrices));
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
