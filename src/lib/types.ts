import { Database } from "./supabase";

export type Program = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  weekPriceId: string;
  dayPriceId?: string;
  canApplySiblingDiscount: boolean;
  isActive: boolean;
};

export type RegistrationInfo =
  Database["public"]["Tables"]["registrations"]["Row"] & {
    program: {
      name: string;
    };
    emergencyContacts: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      relationship: string;
    }[];
  };
