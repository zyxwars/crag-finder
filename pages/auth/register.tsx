import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import { redirectSsr } from "../../lib/redirectSsr";
import { sessionOptions } from "../../lib/session";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);

      await router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>Register</div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          {...register("name", { required: true })}
          placeholder="Name..."
        />
        {errors.name && <span>This field is required</span>}
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email..."
        />
        {errors.email && <span>This field is required</span>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password..."
        />
        {errors.password && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </div>
  );
};

// TODO: Check already has session

export default Register;
