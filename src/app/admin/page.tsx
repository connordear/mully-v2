import AdminLogin from "@/components/AdminLogin";
import { LoadingPage } from "@/components/LoadingCard";
import { getPrograms } from "@/lib/api";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mulhurst Camp Registration Admin",
};

export default async function AdminPage() {
  const programs = await getPrograms();
  return (
    <Suspense fallback={<LoadingPage />}>
      <AdminLogin programs={programs} />
    </Suspense>
  );
}
