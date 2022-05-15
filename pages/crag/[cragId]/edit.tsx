import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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

            await router.push("/");
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

export const getServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext) => {
  // TODO: Check auth
  return { props: {} };
};
export default Edit;
