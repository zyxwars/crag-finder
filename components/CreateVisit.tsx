import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  useFormState,
  UseFormReset,
} from "react-hook-form";

type Inputs = {
  photos: File[];
};

interface Props {
  onSubmit: (data: Inputs, reset: UseFormReset<Inputs>) => void;
}

const CreateVisit = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Inputs>();

  const photos = watch("photos");

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data, reset))}
        className="flex flex-col"
      >
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
