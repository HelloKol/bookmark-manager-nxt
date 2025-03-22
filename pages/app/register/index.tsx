import { useId } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/LoginForm/button";
import { Input } from "@/components/LoginForm/input";
import { Label } from "@/components/LoginForm/label";
import Link from "next/link";
import { auth, db } from "../../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

// Define Yup validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string(),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Define form data type
type FormData = yup.InferType<typeof schema>;

export default function Signup() {
  const router = useRouter();
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
      case "auth/email-already-in-use":
        return "Email already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password is too weak.";
      default:
        return "Signup failed. Please try again.";
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { email, password, firstName, lastName } = data;

    const signupPromise = new Promise<UserCredential>(
      async (resolve, reject) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          // Store additional user details in Realtime Database
          await set(ref(db, `users/${user.uid}`), {
            firstName,
            lastName,
            email,
          });

          // Set session cookie (optional, for server-side authentication)
          const idToken = await user.getIdToken();
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

    toast.promise(signupPromise, {
      pending: "Creating account...",
      success: {
        render() {
          router.push("/");
          return "Signup successful! Logging you in...";
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
    <>
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
                Sign up Origin UI
              </h1>
              <p className="text-sm text-black/50 text-center">
                We just need a few details to get you started.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>First name</Label>
                <Input
                  id={`${id}-firstname`}
                  placeholder="Matt"
                  type="text"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Last name</Label>
                <Input
                  id={`${id}-lastname`}
                  placeholder="Welsh"
                  type="text"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input
                  id={`${id}-email`}
                  placeholder="hi@youremail.com"
                  type="email"
                  required
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
                  required
                  {...register("password")}
                />{" "}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Create Account
            </Button>
          </form>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-black/10 after:h-px after:flex-1 after:bg-black/10">
            <span className="text-xs text-black">Or</span>
          </div>

          <Button variant="outline">
            <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/login`}>
              Sign in
            </Link>
          </Button>

          <p className="text-center text-xs text-black/40">
            By signing up you agree to our{" "}
            <a className="underline hover:no-underline" href="#">
              Terms
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
