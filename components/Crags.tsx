import { Box, Flex, LinkBox } from "@chakra-ui/react";
import { Crag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import SWRError from "./SWRError";

interface Props {
  data: Crag[];
  error: any;
}

const Crags = ({ data, error }: Props) => {
  if (error) return <SWRError error={error} />;

  if (!data) return <div>Loading...</div>;

  return (
    <Flex direction="column" align="center">
      {data.map((crag: Crag) => (
        <Link key={crag.id} href={"/crag/" + crag.id}>
          <LinkBox borderWidth="1px" borderRadius="lg" overflow="hidden">
            {crag.name}
          </LinkBox>
        </Link>
      ))}
    </Flex>
  );
};

export default Crags;
