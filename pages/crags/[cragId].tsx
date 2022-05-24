import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import prisma from "$lib/prisma";
import { Crag } from "@prisma/client";
import { Box, Flex, Heading, Tag } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

interface Props {
  crag: Crag;
}

const Crag = ({ crag }: Props) => {
  return (
    <Flex direction="column" align="center">
      <Heading>{crag.name}</Heading>
      <Box>
        <ReactMarkdown>{crag.content}</ReactMarkdown>
      </Box>

      <Box>
        {crag.tags.split(",").map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </Box>
    </Flex>
  );
};

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const { cragId } = query;

  const crag = await prisma.crag.findUnique({ where: { id: Number(cragId) } });

  if (!crag) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      crag,
    },
  };
};

export default Crag;
