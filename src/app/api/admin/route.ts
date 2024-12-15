// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { getRegistrations } from "@/lib/db";

export async function POST(req: Request) {
  if (!req.body) {
    return new Response(JSON.stringify({ error: "No body" }), {
      status: 400,
    });
  }
  const values = (await req.json()) as { password: string };
  if (!values.password) {
    return new Response(JSON.stringify({ error: "No password" }), {
      status: 400,
    });
  }
  if (values.password !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), {
      status: 401,
    });
  }

  const data = await getRegistrations();

  return Response.json(data);
}
