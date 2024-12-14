import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col space-y-3 p-5">
      <div className="space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

const LoadingCard = () => {
  return (
    <Card>
      <CardContent>
        <LoadingSpinner />
      </CardContent>
    </Card>
  );
};

export const LoadingPage = () => {
  return (
    <main className="md:flex min-h-screen flex-col items-center md:p-24 p-10 bg-gradient">
      <LoadingSpinner />
    </main>
  );
};

export default LoadingCard;
