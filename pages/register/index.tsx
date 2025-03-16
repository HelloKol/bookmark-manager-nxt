import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signup } from "../../lib/auth";
import { useRouter } from "next/router";

// Define Yup validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await signup(data.email, data.password, data.firstName, data.lastName);
      router.push("/dashboard"); // Redirect after signup
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input
          className="bg-zinc-800 p-4 w-84 mb-4 block"
          placeholder="Enter text"
          {...register("firstName")}
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label>Last Name</label>
        <input
          className="bg-zinc-800 p-4 w-84 mb-4 block"
          placeholder="Enter text"
          {...register("lastName")}
        />
        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>

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
        Sign Up
      </button>
    </form>
  );
}
