import { useMutation } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { useAtomValue } from "jotai";
import { twMerge } from "tailwind-merge";
import { CamperInfo, camperInfoAtom } from "./camper";
import { EmergencyContact, contactInfoAtom } from "./emergencyContacts";
import { MedicalInfo, medicalInfoAtom } from "./medical";

export type AllFormValues = CamperInfo &
  MedicalInfo &
  EmergencyContact & { sessionId: string };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function submit(formValues: AllFormValues) {
  return await fetch("/api/form", {
    method: "POST",
    body: JSON.stringify(formValues),
  });
}

export function useSubmitForm(sessionId: string | null) {
  const camperData = useAtomValue(camperInfoAtom);
  const medicalData = useAtomValue(medicalInfoAtom);
  const contactData = useAtomValue(contactInfoAtom);

  const values = {
    ...camperData,
    ...medicalData,
    ...contactData,
  };

  const submitFormMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }
      return await submit({ ...values, sessionId }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to submit form");
      });
    },
  });

  return submitFormMutation;
}
