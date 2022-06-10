import FetchError from "$components/FetchError";
import { Box, Button, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { CragContext } from "store";
import { VisitWithAuthorPhotos } from "types/utils";
import Visit from "./Visit";

interface Props {
  data: VisitWithAuthorPhotos[];
  error: any;
}

const Visits = ({ data, error }: Props) => {
  if (error) return <FetchError error={error} />;

  if (!data)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <Box>
      {data.map((visit) => (
        <Visit key={visit.id} visit={visit} />
      ))}
    </Box>
  );
};

export default Visits;
