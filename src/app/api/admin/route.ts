// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST() {}
//   const cookieStore = cookies();
//   const supabase = createRouteHandlerClient<Database>({
//     cookies: () => cookieStore,
//   });
//   if (!req.body) {
//     return new Response(JSON.stringify({ error: "No body" }), {
//       status: 400,
//     });
//   }
//   const values = (await req.json()) as { password: string };
//   if (!values.password) {
//     return new Response(JSON.stringify({ error: "No password" }), {
//       status: 400,
//     });
//   }
//   if (values.password !== process.env.ADMIN_PASSWORD) {
//     return new Response(JSON.stringify({ error: "Incorrect password" }), {
//       status: 401,
//     });
//   }

//   const { data, error } = await supabase.from("registrations").select(
//     `
//     *,
//     program (name),
//     emergencyContacts (firstName, lastName, email, phone, relationship)
//     `
//   );
//   if (error) {
//     log(error);
//     return new Response(
//       JSON.stringify({
//         error: (error ?? { message: "unknown" }).message,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }

//   return Response.json(data);
// }
