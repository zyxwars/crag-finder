import { UseToastOptions } from "@chakra-ui/react";

export const fetchError: UseToastOptions = {
  title: "Fetch error",
  status: "error",
  duration: 4000,
  isClosable: true,
};
