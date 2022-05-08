import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import { sessionOptions } from "../../lib/session";

const Login = () => {
  const router = useRouter();

  // TODO: Add real form
  const formData = {
    email: "test@test.com",
    password: "gandalf",
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", formData);

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>Login</div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
//   return { props: {} };
// }, sessionOptions);

export default Login;
