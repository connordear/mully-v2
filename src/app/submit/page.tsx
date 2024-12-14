import { LoadingPage } from "@/components/LoadingCard";
import { Metadata } from "next";
import { Suspense } from "react";
import SubmitCard from "./SubmitCard";

export const metadata: Metadata = {
  title: "Mulhurst Camp Registration Form",
};

const SubmitPage = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SubmitCard />
    </Suspense>
  );
};

export default SubmitPage;
