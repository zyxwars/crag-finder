import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit = handleSubmit(async (data) => {
    const res = await axios.post("/api/auth/register", data);

    await router.push("/api/auth/signin");
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" align="center">
        <FormControl isInvalid={!!errors.name}>
          <Input
            placeholder="Name"
            {...register("name", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <Input
            placeholder="Email"
            type="email"
            {...register("email", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <Input
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </Flex>
    </form>
  );
};

// TODO: Check already has session

export default Register;
