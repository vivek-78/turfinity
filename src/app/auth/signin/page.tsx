import { Suspense } from "react";
import Link from "next/link";

import { HeartPulse } from "lucide-react";
import { FaBasketball } from "react-icons/fa6";

import { Skeleton } from "~/components/ui/skeleton";
import SignInForm from "./sign-in-form";

function SignInFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-40 rounded" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="mt-2 h-4 w-64 rounded" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
      </div>
      <div className="mt-4 text-center">
        <Skeleton className="mx-auto h-4 w-40 rounded" />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden bg-secondary/30 duration-150 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:gap-2 xl:w-2/3">
        <div className={"flex items-center gap-2"}>
          <FaBasketball className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">
          Turfinity
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className={"flex items-center justify-center gap-2 lg:justify-start"}>
            <FaBasketball className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold duration-150 sm:text-4xl">
              Turfinity
            </h1>
          </div>
          <div className={"pt-4 text-start"}>
            <h2 className="text-xl font-semibold sm:mt-6 sm:text-2xl">Welcome Back!</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Please login to your account.
            </p>
          </div>
          <Suspense fallback={<SignInFormSkeleton />}>
            <SignInForm />
          </Suspense>
          <div className="mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
