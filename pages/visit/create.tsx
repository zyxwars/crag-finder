import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import { redirectSsr } from "../../lib/redirectSsr";
import { sessionOptions } from "../../lib/session";

type Inputs = {
  description: string;
  photos: File[];
};

const Create = () => {
  const router = useRouter();
  const { cragId } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Inputs>();

  const photos = watch("photos");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // TODO: Upload multiple photos
      const photo = data.photos[0];

      const formData = new FormData();
      formData.set("photo", photo);
      formData.set("description", data.description);
      formData.set("cragId", cragId as string);

      const res = await axios.post("/api/visit", formData);

      console.log(res.data);

      reset();
      await router.push("/visit/" + res.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <textarea
          {...register("description", { required: true })}
          placeholder="Description..."
        />
        {errors.description && <span>This field is required</span>}
        <input
          {...register("photos", { required: true })}
          type="file"
          multiple
        />
        {errors.photos && <span>This field is required</span>}

        <input type="submit" />
      </form>

      {photos &&
        Array.from(photos).map((photo) => (
          <Image
            key={photo.name}
            src={URL.createObjectURL(photo)}
            alt={photo.name}
            width={100}
            height={100}
          />
        ))}
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const session = await withAuthSsr(req);

    if (!session)
      // TODO: Do this programmatically
      redirectSsr(res, "/auth/login?from=/visit/create?cragId=" + query.cragId);

    return { props: { session } };
  },
  sessionOptions
);

export default Create;
