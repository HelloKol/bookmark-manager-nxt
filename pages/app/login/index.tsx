import { useId } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import router from "next/router";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

import { Button } from "@/components/LoginForm/button";
import { Checkbox } from "@/components/LoginForm/checkbox";
import { Input } from "@/components/LoginForm/input";
import { Label } from "@/components/LoginForm/label";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Define Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Define form data type
type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const getFirebaseAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-credential":
        return "Invalid credentials. Please check your email and password.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    const { email, password } = data;

    const loginPromise = new Promise<UserCredential>(
      async (resolve, reject) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredential.user.getIdToken();

          // Set session cookie (optional, for server-side authentication)
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to create session cookie");
          }

          resolve(userCredential);
        } catch (error) {
          reject(error);
        }
      }
    );

    toast.promise(loginPromise, {
      pending: "Logging in...",
      success: {
        render() {
          router.push("/");
          return "Login successful!";
        },
      },
      // Check if the error is a FirebaseError and show friendly messages
      error: {
        render({ data }) {
          if (data instanceof FirebaseError) {
            return getFirebaseAuthErrorMessage(data.code);
          } else if (data instanceof Error) {
            return data.message;
          } else {
            return "An unexpected error occurred.";
          }
        },
      },
    });
  };

  return (
    <main>
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="grid max-h-[calc(100%-4rem)] w-full gap-4 overflow-y-auto border bg-white p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <svg
                className="stroke-zinc-800"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>

            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h1 className="text-lg font-semibold tracking-tight text-black text-center">
                Welcome back
              </h1>
              <p className="text-sm text-black/50 text-center">
                Enter your credentials to login to your account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input
                  id={`${id}-email`}
                  placeholder="hi@youremail.com"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>Password</Label>
                <Input
                  id={`${id}-password`}
                  placeholder="Enter your password"
                  type="password"
                  {...register("password")}
                />{" "}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id={`${id}-remember`} />
                <Label
                  htmlFor={`${id}-remember`}
                  className="font-normal text-black/40"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm underline hover:no-underline text-black"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Sign in
            </Button>
          </form>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-black/10 after:h-px after:flex-1 after:bg-black/10">
            <span className="text-xs text-black">Or</span>
          </div>

          <Button variant="outline">
            <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/register`}>
              Create Free Account
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
