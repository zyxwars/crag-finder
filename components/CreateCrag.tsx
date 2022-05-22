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
import React from "react";
import { useForm } from "react-hook-form";

type FormData = Omit<Crag, "authorId" | "id">;

const CreateCrag = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const onSubmit = handleSubmit(async (data) => {
    const res = await axios.post("/api/crags", data);
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
            {...register("content")}
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

export default CreateCrag;
