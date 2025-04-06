"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
// import { useToast } from "~/components/ui/use-toast";

import type { SubmitHandler } from "react-hook-form";
import FormInput from "~/components/custom/FormInput";
import { Input } from "~/components/ui/input";

const signUpSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required"
    })
    .min(4, "First name cannot be less than 4 characters")
    .max(20, "First name cannot be longer than 20 characters"),
  lastName: z
    .string({
      required_error: "Last name is required"
    })
    .min(4, "Last name cannot be less than 4 characters")
    .max(20, "Last name cannot be longer than 20 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number cannot be longer than 15 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot be longer than 50 characters")
});

type FormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
//   const { status } = useSession();
  const router = useRouter();
//   const { toast } = useToast();
  const formMethods = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(signUpSchema)
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false); // State for loading

  const signUpMutation = api.auth.signup.useMutation();

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      await signUpMutation.mutateAsync(data, {
        onSuccess: () => {
        //   toast({
        //     title: "Account created!"
        //   });
          signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
            callbackUrl: "/"
          })
            .then(() => {
              void router.push("/");
            })
            .catch(() => null);
        },
        onError: (error) => {
          console.log(error);
        //   toast({
        //     title: "Account Creation Failed",
        //     description:
        //       "We couldn't create your account at this time. Please check your information and try again",
        //     variant: "destructive"
        //   });
        }
      });
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     if (status === "authenticated") {
//       void router.push("/");
//     }
//   }, [status]);

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput<FormData>
              control={formMethods.control}
              name={"firstName"}
              placeholder={"John"}
              label={"First name"}
            />
            <FormInput<FormData>
              control={formMethods.control}
              name={"lastName"}
              placeholder={"Doe"}
              label={"Last Name"}
            />
          </div>
          <FormInput<FormData>
            control={formMethods.control}
            name={"phone"}
            type={"tel"}
            placeholder={"9012345678"}
            label={"Phone Number"}
          />
          <FormInput<FormData>
            control={formMethods.control}
            name={"email"}
            placeholder={"johndoe@example.com"}
            label={"Email"}
          />
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <>Creating account...</>
              </>
            ) : (
              "Create an account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
