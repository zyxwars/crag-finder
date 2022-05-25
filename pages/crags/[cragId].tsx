import React from "react";
import { GetServerSidePropsContext } from "next";
import prisma from "$lib/prisma";
import { Crag } from "@prisma/client";
import { Box, Flex, Heading, Tag } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import CreateComment from "$components/CreateComment";
import Comments from "$components/Comments";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";

interface Props {
  crag: Crag;
}

const Crag = ({ crag }: Props) => {
  const { data: session, status } = useSession();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + crag.id + "/comments"
  );
  const { mutate } = useSWRConfig();

  return (
    <Flex direction="column" align="center">
      <Heading>{crag.name}</Heading>
      <Box>
        <ReactMarkdown>{crag.body}</ReactMarkdown>
      </Box>

      <Box>
        {crag.tags.split(",").map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </Box>

      <Heading>Comments</Heading>
      {status === "authenticated" && (
        <CreateComment
          onPost={async (data) => {
            const url = "/api/crags/" + crag.id + "/comments";
            const res = await axios.post(url, { body: data });

            await mutate(url);
          }}
        />
      )}
      <Comments data={comments} error={commentsError} />
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
      fallback: {},
      crag,
    },
  };
};

export default Crag;
