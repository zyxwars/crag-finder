import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import { sessionOptions } from "../../lib/session";

type Inputs = {
  name: string;
  content: string;
};

const Create = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axios.post("/api/crag", data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const session = await withAuthSsr(req);

  return { props: { session } };
}, sessionOptions);

export default Create;
