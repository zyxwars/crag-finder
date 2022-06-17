import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  LinkBox,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Crag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import FetchError from "./FetchError";

interface Props {
  data: Crag[];
  error: any;
}

const Crags = ({ data, error }: Props) => {
  if (error) return <FetchError error={error} />;

  if (!data)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
      {data.map((crag: Crag) => (
        <Link key={crag.id} href={"/crags/" + crag.id}>
          <LinkBox mb="4" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image
              height="10rem"
              width="100%"
              objectFit="cover"
              src="https://images.unsplash.com/photo-1520443819063-a64183e22528?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170"
              alt="test"
            />

            <Box p="2">
              <Text fontSize="xl">{crag.name}</Text>

              <Box>{crag.tags}</Box>
            </Box>
          </LinkBox>
        </Link>
      ))}
    </Grid>
  );
};

export default Crags;
