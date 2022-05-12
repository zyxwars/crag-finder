import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";

type Inputs = {
  photos: File[];
};

interface Props {
  onSubmit: SubmitHandler<Inputs>;
}

const CreateVisit = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const photos = watch("photos");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          {...register("photos", { required: true })}
          type="file"
          multiple
        />

        <input type="submit" />
      </form>

      {photos &&
        Array.from(photos).map((photo) => (
          <img key={photo.name} src={URL.createObjectURL(photo)}></img>
        ))}
    </>
  );
};

export default CreateVisit;
