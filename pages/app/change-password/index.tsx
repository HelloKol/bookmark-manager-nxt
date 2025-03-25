import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useId, useState } from "react";
import { FirebaseError } from "firebase/app";

import { Button } from "@/components/LoginForm/button";
import { Input } from "@/components/LoginForm/input";
import { Label } from "@/components/LoginForm/label";

interface FormData {
  newPassword: string;
}

const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

export default function ChangePassword() {
  const router = useRouter();
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [code, setCode] = useState<string | null>(null);
  const { oobCode } = router.query; // This is provided in the URL query parameters

  // Ensure oobCode is set (it might come as string | string[] or undefined)
  useEffect(() => {
    if (typeof oobCode === "string") {
      setCode(oobCode);
    }
  }, [oobCode]);

  const getFirebaseAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";
      case "auth/expired-action-code":
        return "The reset code has expired. Please request a new one.";
      case "auth/invalid-action-code":
        return "Invalid reset code. Please check the link and try again.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!code) {
      toast.error("Invalid or missing reset code.");
      return;
    }

    const resetPasswordPromise = new Promise<void>(async (resolve, reject) => {
      try {
        await confirmPasswordReset(auth, code, data.newPassword);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(resetPasswordPromise, {
      pending: "Resetting password...",
      success: {
        render() {
          router.push("/login");
          return "Password reset successful! You can now log in with your new password.";
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
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <form
    //     onSubmit={handleSubmit(onSubmit)}
    //     className="p-6 bg-white rounded shadow-md"
    //   >
    //     <h2 className="mb-4 text-2xl font-bold">Set New Password</h2>
    //     <div className="mb-4">
    //       <label htmlFor="newPassword" className="block mb-1 font-bold">
    //         New Password
    //       </label>
    //       <input
    //         id="newPassword"
    //         type="password"
    //         {...register("newPassword")}
    //         className="w-full p-2 border border-gray-300 rounded"
    //         placeholder="Enter your new password"
    //       />
    //       {errors.newPassword && (
    //         <p className="text-red-600">{errors.newPassword.message}</p>
    //       )}
    //     </div>
    //     <button
    //       type="submit"
    //       className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
    //     >
    //       Reset Password
    //     </button>
    //   </form>
    // </div>

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
                <Label htmlFor={`${id}-password`}>New Password</Label>
                <Input
                  id={`${id}-password`}
                  placeholder="Enter your password"
                  type="password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
