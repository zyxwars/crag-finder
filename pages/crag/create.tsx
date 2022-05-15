import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  content: string;
};

const Create = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post("/api/crag", data);

      await router.push("/crag/" + res.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <input {...register("name", { required: true })} placeholder="Name..." />
      {errors.name && <span>This field is required</span>}
      <textarea
        {...register("content", { required: true })}
        placeholder="Content..."
      />
      {errors.content && <span>This field is required</span>}

      <input type="submit" />
    </form>
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

export default Create;
