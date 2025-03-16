import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../lib/auth";
import router from "next/router";
import Link from "next/link";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <main>
      <Link href="/dashboard">Dashboard</Link>
      <form onSubmit={handleSubmit(onSubmit)}>
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
      </form>
    </main>
  );
}
