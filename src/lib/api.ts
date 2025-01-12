import { Program } from "./types";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mulhurst-registration.vercel.app";

export async function getPrograms() {
  const response = await fetch(baseUrl + "/api/form");
  const data = (await response.json()) as Program[];
  return data;
}

export async function getPaymentStatus(session_id: string) {
  const res = await fetch(`/api/stripe?session_id=${session_id}`).then((res) =>
    res.json()
  );
  return res;
}
