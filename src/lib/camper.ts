import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

export enum SwimmingLevel {
  NONE = "None",
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export const swimmingLevelOptions = [
  {
    value: SwimmingLevel.NONE,
    label: "None (Must wear life jacket in shallow water)",
  },
  {
    value: SwimmingLevel.BEGINNER,
    label: "Beginner (has taken some swimming lessons)",
  },
  {
    value: SwimmingLevel.INTERMEDIATE,
    label: "Intermediate (confident in deep water)",
  },
  { value: SwimmingLevel.ADVANCED, label: "Advanced (strong swimmer)" },
];

export enum TShirtSize {
  YOUTH_S = "YOUTH_S",
  YOUTH_M = "YOUTH_M",
  YOUTH_L = "YOUTH_L",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export const tShirtSizeOptions = [
  { value: TShirtSize.YOUTH_S, label: "Youth S" },
  { value: TShirtSize.YOUTH_M, label: "Youth M" },
  { value: TShirtSize.YOUTH_L, label: "Youth L" },
  { value: TShirtSize.S, label: "S" },
  { value: TShirtSize.M, label: "M" },
  { value: TShirtSize.L, label: "L" },
  { value: TShirtSize.XL, label: "XL" },
  { value: TShirtSize.XXL, label: "XXL" },
];

export const heardAboutUsOptions = [
  { value: "friend", label: "Friend" },
  { value: "family", label: "Family" },
  { value: "school", label: "School" },
  { value: "church", label: "Church" },
  { value: "socialMedia", label: "Social Media" },
  { value: "other", label: "Other" },
];

export const NO_SIBLING = "No sibling";

export const addressSchema = z.object({
  line1: z.string().min(1, { message: "Address is required" }).max(100),
  line2: z.string().min(0).max(100),
  city: z.string().min(1, { message: "City is required" }).max(50),
  stateProv: z
    .string()
    .min(2, { message: "State/Province is required" })
    .max(2, { message: "Please use your state/province 2-letter code" }),
  postalZip: z
    .string()
    .min(5, { message: "Postal/ZIP Code is required" })
    .max(10, { message: "Invalid Postal/ZIP Code" }),
  country: z.string().min(2, { message: "Country is required" }).max(50),
});

export const camperFormSchema = z.object({
  program: z.string().min(1, { message: "Program is required" }),
  priceId: z.string().min(1, { message: "Price ID is required" }),
  daysOfWeek: z.optional(
    z
      .array(z.string())
      .min(1, { message: "Please select at least 1 day" })
      .max(2, { message: "You can only select up to 2 days" })
  ),
  email: z.string().email(),
  firstName: z.string().min(1, { message: "First Name is required" }).max(50),
  lastName: z.string().min(1, { message: "Last Name is required" }).max(50),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, { message: "Invalid date" }),
  address: addressSchema,
  arePhotosAllowed: z.boolean(),
  swimmingLevel: z.string().min(1, { message: "Swimming Level is required" }),
  hasBeenToCampBefore: z.boolean(),
  howDidYouHearAboutUs: z.string().min(1, { message: "Required" }),
  friendCabinRequest: z.string().max(100),
  gender: z.string().min(1, { message: "Required" }),
  tShirtSize: z.string().min(1, { message: "T-Shirt Size is required" }),
  parentSignature: z.string().min(1, { message: "Signature is required" }),
  siblingNameForDiscount: z
    .string()
    .min(1, { message: "Sibling name is required to claim discount" })
    .max(50),
});

export type CamperInfo = z.infer<typeof camperFormSchema>;

export const defaultCamperInfo: CamperInfo = {
  program: "0",
  priceId: "0",
  daysOfWeek: undefined,
  email: "",
  firstName: "",
  lastName: "",
  birthdate: "2000-01-01",
  address: {
    line1: "",
    line2: "",
    city: "",
    stateProv: "AB",
    postalZip: "",
    country: "CA",
  },
  arePhotosAllowed: true,
  swimmingLevel: SwimmingLevel.BEGINNER,
  hasBeenToCampBefore: true,
  howDidYouHearAboutUs: heardAboutUsOptions[0].value,
  friendCabinRequest: "",
  gender: "",
  tShirtSize: TShirtSize.M,
  parentSignature: "",
  siblingNameForDiscount: NO_SIBLING,
};

export const camperInfoAtom = atomWithStorage<CamperInfo>(
  "camperInfo",
  defaultCamperInfo,
  {
    getItem(key, initialValue) {
      const storedValue = localStorage.getItem(key);
      try {
        return camperFormSchema.parse(JSON.parse(storedValue ?? ""));
      } catch {
        return initialValue;
      }
    },
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
    subscribe(key, callback, initialValue) {
      if (
        typeof window === "undefined" ||
        typeof window.addEventListener === "undefined"
      ) {
        return () => null;
      }
      window.addEventListener("storage", (e) => {
        if (e.storageArea === localStorage && e.key === key) {
          let newValue;
          try {
            newValue = camperFormSchema.parse(JSON.parse(e.newValue ?? ""));
          } catch {
            newValue = initialValue;
          }
          callback(newValue);
        }
      });
      return () => {
        window.removeEventListener("storage", () => null);
      };
    },
  }
);
