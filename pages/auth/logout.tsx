import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

const Logout = () => {
  const router = useRouter();

  return (
    <>
      <div>Logout</div>
      <button
        onClick={async () => {
          try {
            await axios.post("/api/auth/logout");

            router.push((router.query.from as string) || "/auth/login");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
