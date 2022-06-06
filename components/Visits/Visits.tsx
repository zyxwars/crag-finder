import FetchError from "$components/FetchError";
import { Box, Spinner, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { VisitWithAuthorPhotos } from "types/utils";

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

  console.log(data);

  return (
    <Box>
      {data.map((visit) => (
        <Box key={visit.id}>
          <Text>{visit.author.name}</Text>
          {visit.photos.map((photo) => (
            <Image
              key={photo.id}
              src={"/api/uploads/" + photo.newFilename}
              alt={photo.originalFilename}
              width={100}
              height={100}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default Visits;
