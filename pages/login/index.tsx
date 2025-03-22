import { useId } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import router from "next/router";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { login } from "../../lib/auth";

import { Button } from "@/components/LoginForm/button";
import { Checkbox } from "@/components/LoginForm/checkbox";
import { Input } from "@/components/LoginForm/input";
import { Label } from "@/components/LoginForm/label";

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const user = await login(data.email, data.password);
      console.log(user);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
            toast.error("No user found with this email.");
            break;
          case "auth/wrong-password":
            toast.error("Incorrect password.");
            break;
          case "auth/invalid-credential":
            toast.error(
              "Invalid credentials. Please check your email and password."
            );
            break;
          case "auth/too-many-requests":
            toast.error("Too many failed attempts. Please try again later.");
            break;
          default:
            toast.error("Something went wrong. Please try again.");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <main>
      {/* <Link href="/dashboard">Dashboard</Link> */}

      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            className="bg-zinc-800 p-4 w-84 mb-4 block"
            placeholder="Enter text"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            className="bg-zinc-800 p-4 w-84 mb-4 block"
            placeholder="Enter text"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button className="p-4 bg-amber-800" type="submit">
          Login
        </button>
      </form> */}

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
                  required
                  {...register("email")}
                />
                {errors.email && <p>{errors.email.message}</p>}
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
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id={`${id}-remember`} />
                <Label
                  htmlFor={`${id}-remember`}
                  className="font-normal text-black"
                >
                  Remember me
                </Label>
              </div>
              <a
                className="text-sm underline hover:no-underline text-black"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-black/10 after:h-px after:flex-1 after:bg-black/10">
            <span className="text-xs text-black">Or</span>
          </div>

          <Button variant="outline">Login with Google</Button>
        </div>
      </div>
    </main>
  );
}
