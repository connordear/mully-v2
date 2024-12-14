import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

export const relationshipOptions = [
  "Mother",
  "Father",
  "Guardian",
  "Grandparent",
  "Caregiver",
  "Other",
] as const;

export const contactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be less than 15 digits long"),
  relationship: z.enum(relationshipOptions).optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const defaultContactFields: Contact = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

export const emergencyContactsSchema = z.object({
  contacts: z.array(contactSchema).min(2),
});

export type EmergencyContact = z.infer<typeof emergencyContactsSchema>;

export const defaultEmergencyContactInfo: EmergencyContact = {
  contacts: [defaultContactFields, defaultContactFields],
};

export const contactInfoAtom = atomWithStorage<EmergencyContact>(
  "emergencyContacts",
  defaultEmergencyContactInfo
);
