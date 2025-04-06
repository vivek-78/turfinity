"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { z } from "zod";

// import { useToast } from "~/shared/shadcn/ui/use-toast";

import { useForm, type SubmitHandler } from "react-hook-form";
import FormInput from "~/components/custom/FormInput";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

// Define the zod schema
const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email cannot be empty"
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password cannot be empty"
    })
    .min(8, "Password must be at least 8 characters")
});

type FormData = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

//   const { toast } = useToast();
  const [loading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const formMethods = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema)
  });
  // const formMethods = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (signInResponse?.ok) {
        router.push(callbackUrl ?? "/");
      } else {
        // toast({
        //   title: "Invalid credentials",
        //   variant: "destructive",
        //   description: "Please check your email and password and try again.",
        //   duration: 3000
        // });
        console.log("Invalid credentials");
      }
      setIsLoading(false);
    } catch (error: unknown) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormInput
            control={formMethods.control}
            name={"email"}
            disabled={loading}
            label={"Email"}
            placeholder={"john@example.com"}
          />
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={loading}
                      placeholder={"••••••••"}
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="border border-input focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      {showPassword ? (
                        <EyeOff className={"h-4 w-4"} />
                      ) : (
                        <Eye className={"h-4 w-4"} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={"w-full"} variant="default" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <>Logging In...</>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
