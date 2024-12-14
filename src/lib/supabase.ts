export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      emergencyContacts: {
        Row: {
          created_at: string;
          email: string | null;
          firstName: string | null;
          forCamper: number;
          id: number;
          lastName: string | null;
          phone: string | null;
          relationship: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          firstName?: string | null;
          forCamper: number;
          id?: number;
          lastName?: string | null;
          phone?: string | null;
          relationship?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          firstName?: string | null;
          forCamper?: number;
          id?: number;
          lastName?: string | null;
          phone?: string | null;
          relationship?: string | null;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          canApplySiblingDiscount: boolean;
          created_at: string;
          dayPriceId: string | null;
          endDate: string;
          id: number;
          name: string | null;
          startDate: string;
          weekPriceId: string;
        };
        Insert: {
          canApplySiblingDiscount?: boolean;
          created_at?: string;
          dayPriceId?: string | null;
          endDate?: string;
          id?: number;
          name?: string | null;
          startDate?: string;
          weekPriceId: string;
        };
        Update: {
          canApplySiblingDiscount?: boolean;
          created_at?: string;
          dayPriceId?: string | null;
          endDate?: string;
          id?: number;
          name?: string | null;
          startDate?: string;
          weekPriceId?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          addressLine1: string | null;
          addressLine2: string | null;
          allergies: string | null;
          allowedOverTheCounterMedications: string[] | null;
          arePhotosAllowed: boolean;
          birthdate: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          daysOfWeek: string[] | null;
          dietaryRestrictions: string | null;
          doctorPhone: string | null;
          email: string | null;
          epiPen: string | null;
          familyDoctor: string | null;
          firstName: string | null;
          friendCabinRequest: string | null;
          gender: string | null;
          hasBeenToCampBefore: boolean;
          healthCareNumber: string | null;
          height: string | null;
          howDidYouHearAboutUs: string | null;
          id: number;
          lastName: string | null;
          medicalConditions: string | null;
          medicationsTreatments: string | null;
          other: string | null;
          parentSignature: string | null;
          paymentId: string | null;
          postalZip: string | null;
          program: number | null;
          regularMedicationsNotTakingAtCamp: string | null;
          siblingNameForDiscount: string | null;
          stateProv: string | null;
          swimmingLevel: string | null;
          tShirtSize: string | null;
          weight: string | null;
        };
        Insert: {
          addressLine1?: string | null;
          addressLine2?: string | null;
          allergies?: string | null;
          allowedOverTheCounterMedications?: string[] | null;
          arePhotosAllowed?: boolean;
          birthdate?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          daysOfWeek?: string[] | null;
          dietaryRestrictions?: string | null;
          doctorPhone?: string | null;
          email?: string | null;
          epiPen?: string | null;
          familyDoctor?: string | null;
          firstName?: string | null;
          friendCabinRequest?: string | null;
          gender?: string | null;
          hasBeenToCampBefore?: boolean;
          healthCareNumber?: string | null;
          height?: string | null;
          howDidYouHearAboutUs?: string | null;
          id?: number;
          lastName?: string | null;
          medicalConditions?: string | null;
          medicationsTreatments?: string | null;
          other?: string | null;
          parentSignature?: string | null;
          paymentId?: string | null;
          postalZip?: string | null;
          program?: number | null;
          regularMedicationsNotTakingAtCamp?: string | null;
          siblingNameForDiscount?: string | null;
          stateProv?: string | null;
          swimmingLevel?: string | null;
          tShirtSize?: string | null;
          weight?: string | null;
        };
        Update: {
          addressLine1?: string | null;
          addressLine2?: string | null;
          allergies?: string | null;
          allowedOverTheCounterMedications?: string[] | null;
          arePhotosAllowed?: boolean;
          birthdate?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          daysOfWeek?: string[] | null;
          dietaryRestrictions?: string | null;
          doctorPhone?: string | null;
          email?: string | null;
          epiPen?: string | null;
          familyDoctor?: string | null;
          firstName?: string | null;
          friendCabinRequest?: string | null;
          gender?: string | null;
          hasBeenToCampBefore?: boolean;
          healthCareNumber?: string | null;
          height?: string | null;
          howDidYouHearAboutUs?: string | null;
          id?: number;
          lastName?: string | null;
          medicalConditions?: string | null;
          medicationsTreatments?: string | null;
          other?: string | null;
          parentSignature?: string | null;
          paymentId?: string | null;
          postalZip?: string | null;
          program?: number | null;
          regularMedicationsNotTakingAtCamp?: string | null;
          siblingNameForDiscount?: string | null;
          stateProv?: string | null;
          swimmingLevel?: string | null;
          tShirtSize?: string | null;
          weight?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_registrations_program_fkey";
            columns: ["program"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
