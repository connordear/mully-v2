"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPaymentStatus } from "@/lib/api";
import { useSubmitForm } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SubmitCard = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const submit = useSubmitForm(session_id);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["paymentStatus", session_id],
    queryFn: () => getPaymentStatus(session_id!),
    enabled: session_id !== null,
  });

  useEffect(() => {
    if (data && data.status === "complete" && !hasSubmitted) {
      setHasSubmitted(true);
      submit.mutateAsync();
    }
  }, [data, submit, hasSubmitted]);

  const text = useMemo(() => {
    if (submit.isPending || isLoading) return "Submitting...";
    if (submit.isError) return "Error submitting form.";
    if (submit.isSuccess) return "Form submitted successfully!";
    return "Unknown error";
  }, [submit, isLoading]);

  const navToHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="md:flex min-h-screen flex-col items-center md:p-24 p-10 bg-gradient">
      <Card className="mb-10">
        <CardHeader>
          <h1 className="text-4xl font-bold color-white text-center">
            Mulhurst Camp Registration Submission
          </h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col align-center">
            <h2 className="mt-10 text-center">{text}</h2>
            {!submit.isPending && (
              <Button className="mt-10" onClick={navToHome}>
                {submit.isSuccess
                  ? "Register Another Camper"
                  : "Return Home to try again"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SubmitCard;
