import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Crag } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

type Inputs = Omit<Crag, "authorId" | "id">;

const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit = handleSubmit(async (data) => {
    const res = await axios.post("/api/crags", data);

    await router.push("/crags/" + res.data.id);
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <Flex direction="column" align="center">
          <FormControl isInvalid={!!errors.name}>
            <Input
              placeholder="Crag name"
              {...register("name", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <Textarea
            placeholder="Crag content (markdown)"
            {...register("body")}
          />

          <FormControl isInvalid={!!errors.name}>
            <Input
              placeholder="Tags (El Capitan,Yosemite,Granite,Beginner)"
              {...register("tags", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.tags && errors.tags.message}
            </FormErrorMessage>
          </FormControl>

          <Button isLoading={isSubmitting} type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Page;
