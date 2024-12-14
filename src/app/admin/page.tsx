import AdminLogin from "@/components/AdminLogin";
import { LoadingPage } from "@/components/LoadingCard";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mulhurst Camp Registration Admin",
};

const AdminPage = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AdminLogin />
    </Suspense>
  );
};

export default AdminPage;
