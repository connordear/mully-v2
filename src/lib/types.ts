import { Database } from "./supabase";

export type ProgramPrice = {
  id: string;
  name: string;
  isDayPrice: boolean;
};

export type Program = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  defaultPriceId?: string;
  weekPrices: ProgramPrice[];
  dayPrices?: ProgramPrice[];
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
