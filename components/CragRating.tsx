import { fetchError } from "$lib/toastOptions";
import { Box, Button, Flex, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import error from "next/error";
import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { CragContext } from "store";
import useSWR from "swr";
import FetchError from "./FetchError";

const CragRating = () => {
  const crag = useContext(CragContext);
  const toast = useToast();

  const { data: rating, error: ratingError } = useSWR(
    "/api/crags/" + crag.id + "/ratings"
  );

  if (ratingError) return <FetchError error={ratingError} />;

  if (!rating)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  console.log(rating);

  return (
    <Box>
      <Button
        onClick={async () => {
          try {
            const res = await axios.post("/api/crags/" + crag.id + "/ratings", {
              rating: 5,
            });
          } catch (error: any) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }
        }}
      >
        Rate
      </Button>

      <Flex justify="center">
        {[...Array(rating.averageRating)].map((e, i) => (
          <FaStar key={i} />
        ))}
      </Flex>
    </Box>
  );
};

export default CragRating;
