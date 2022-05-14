import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { withAuthSsr } from "../../../lib/middleware/withAuthSsr";
import { redirectSsr } from "../../../lib/redirectSsr";
import { sessionOptions } from "../../../lib/session";

const Edit = () => {
  const router = useRouter();

  return (
    <div>
      <form></form>
      <button
        onClick={async () => {
          try {
            const res = await axios.delete(
              "/api/crag/" + router?.query?.cragId
            );

            router.push("/");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const session = await withAuthSsr(req);

    if (!session)
      redirectSsr(res, "/auth/login?from=/crag/" + query.cragId + "/edit");

    return { props: { session } };
  },
  sessionOptions
);

export default Edit;
