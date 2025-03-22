import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { toast } from "react-toastify";
import { useId } from "react";

import { Button } from "@/components/LoginForm/button";
import { Input } from "@/components/LoginForm/input";
import { Label } from "@/components/LoginForm/label";
import { FirebaseError } from "firebase/app";

interface FormData {
  email: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
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
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/change-password`,
      handleCodeInApp: true,
      // linkDomain: "app.localhost",
    };

    const resetPasswordPromise = new Promise<void>(async (resolve, reject) => {
      try {
        await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(resetPasswordPromise, {
      pending: "Sending password reset email...",
      success: {
        render() {
          return "Password reset email sent. Please check your inbox.";
        },
      },
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
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Send Reset Email
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
