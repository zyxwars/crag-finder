import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  LinkBox,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Crag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import SWRError from "./SWRError";

interface Props {
  data: Crag[];
  error: any;
}

const Crags = ({ data, error }: Props) => {
  const images = [
    "https://images.unsplash.com/photo-1536639070539-43ec572aca6d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470",
    "https://images.unsplash.com/photo-1593132517397-ceb31d77194a?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764",
    "https://images.unsplash.com/photo-1581100923924-7e4e234392ba?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687",
    "https://images.unsplash.com/photo-1520443819063-a64183e22528?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170",
  ];

  if (error) return <SWRError error={error} />;

  if (!data) return <div>Loading...</div>;

  return (
    <SimpleGrid minChildWidth="12rem" spacing="1rem">
      {data.map((crag: Crag) => (
        <Link key={crag.id} href={"/crags/" + crag.id}>
          <LinkBox
            mb="4"
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              height="10rem"
              width="100%"
              objectFit="cover"
              src={images[Math.floor(Math.random() * images.length)]}
              alt="test"
            />

            <Box p="2">
              <Text fontSize="xl">{crag.name}</Text>

              <Box>{crag.tags}</Box>
            </Box>
          </LinkBox>
        </Link>
      ))}
    </SimpleGrid>
  );
};

export default Crags;
