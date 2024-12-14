import MullyForm from "@/components/MullyForm";
import { Card, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mulhurst Camp Registration Form",
};

export default async function Home() {
  return (
    <main className="md:flex min-h-screen flex-col items-center md:p-24 p-10 bg-gradient">
      <link rel="icon" href="/mully.png" sizes="any" />
      <Card className="mb-10">
        <CardHeader>
          <h1 className="text-4xl font-bold color-white text-center">
            Mulhurst Camp Registration Form
          </h1>
        </CardHeader>
      </Card>
      <MullyForm />
    </main>
  );
}
