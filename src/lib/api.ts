import { useQuery } from "@tanstack/react-query";
import { Program } from "./types";

export async function getPrograms() {
  const response = await fetch("/api/form");
  const data = (await response.json()) as Program[];
  return data;
}

export function useGetPrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
    select: (data) => data.filter((program) => program.isActive),
  });
}

export async function getPaymentStatus(session_id: string) {
  const res = await fetch(`/api/stripe?session_id=${session_id}`).then((res) =>
    res.json()
  );
  return res;
}
