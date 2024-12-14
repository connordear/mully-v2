import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

export const NO_ALLERGIES = "No, my child does not have any allergies.";
export const NO_EPIPEN = "No, my child does not require an EpiPen.";
export const NO_MEDICATIONS_TREATMENTS =
  "No, my child does not require any medications or treatments.";
export const NO_MEDICATIONS_NOT_TAKING_AT_CAMP =
  "There are no medications my child is taking that they will not be taking at camp.";
export const NO_MEDICAL_CONDITIONS =
  "No, my child does not have any medical conditions.";
export const overTheCounterMedications = [
  {
    key: "Acetaminophen",
    label: "Acetaminophen (Tylenol)",
  },
  {
    key: "Ibuprofen",
    label: "Ibuprofen (Advil)",
  },
  {
    key: "Antacids",
    label: "Antacids (Tums, Rolaids)",
  },
  {
    key: "Antihistamines",
    label: "Antihistamines (Benadryl)",
  },
  {
    key: "Antibiotic Cream",
    label: "Antibiotic Cream",
  },
  {
    key: "Sting Relief",
    label: "Sting Relief/Cream",
  },
  {
    key: "Insect Repellent",
    label: "Insect Repellent",
  },
  {
    key: "Sunscreen",
    label: "Sunscreen",
  },
  {
    key: "Solarcaine",
    label: "Sunburn Spray (Solarcaine)",
  },
  {
    key: "Sudafed",
    label: "Sudafed (Decongestant)",
  },
];

export const medicalFormSchema = z.object({
  healthCareNumber: z
    .string()
    .min(1, "Health care number is required")
    .max(50, "Must be less than 50 characters"),
  familyDoctor: z.string().min(0).max(50, "Must be less than 50 characters"),
  doctorPhone: z.string().min(0).max(50, "Must be less than 50 characters"),
  height: z.string().min(0).max(50, "Must be less than 50 characters"),
  weight: z.string().min(0).max(50, "Must be less than 50 characters"),
  allergies: z.string().min(0).max(500, "Must be less than 500 characters"),
  epiPen: z.string().min(0).max(500, "Must be less than 500 characters"),
  medicationsTreatments: z
    .string()
    .min(0)
    .max(500, "Must be less than 500 characters"),
  regularMedicationsNotTakingAtCamp: z
    .string()
    .min(0)
    .max(500, "Must be less than 500 characters"),
  medicalConditions: z
    .string()
    .min(0)
    .max(500, "Must be less than 500 characters"),
  dietaryRestrictions: z
    .string()
    .min(0)
    .max(500, "Must be less than 500 characters"),
  other: z.string().min(0).max(500, "Must be less than 500 characters"),
  allowedOverTheCounterMedications: z.array(z.string()),
});

export type MedicalInfo = z.infer<typeof medicalFormSchema>;

export const defaultMedicalInfo: MedicalInfo = {
  healthCareNumber: "",
  familyDoctor: "",
  doctorPhone: "",
  height: "",
  weight: "",
  allergies: NO_ALLERGIES,
  epiPen: NO_EPIPEN,
  medicationsTreatments: NO_MEDICATIONS_TREATMENTS,
  regularMedicationsNotTakingAtCamp: NO_MEDICATIONS_NOT_TAKING_AT_CAMP,
  medicalConditions: NO_MEDICAL_CONDITIONS,
  dietaryRestrictions: "",
  other: "",
  allowedOverTheCounterMedications: overTheCounterMedications.map(
    (med) => med.key
  ),
};

export const medicalInfoAtom = atomWithStorage<MedicalInfo>(
  "medicalInfo",
  defaultMedicalInfo
);
