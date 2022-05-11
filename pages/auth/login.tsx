import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import { redirectSsr } from "../../lib/redirectSsr";
import { sessionOptions } from "../../lib/session";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);

      router.push((router.query.from as string) || "/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>Login</div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
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

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const session = await withAuthSsr(req);

  if (session) redirectSsr(res, "/auth/logout?from=/auth/login");

  return { props: { session } };
}, sessionOptions);

export default Login;
