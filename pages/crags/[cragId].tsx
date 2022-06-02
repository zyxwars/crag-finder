import React, { createContext } from "react";
import { GetServerSidePropsContext } from "next";
import prisma from "$lib/prisma";
import { Crag } from "@prisma/client";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Tag,
  useToast,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { getSession, useSession } from "next-auth/react";
import CreateComment from "$components/Comments/CreateComment";
import Comments from "$components/Comments/Comments";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { CragContext } from "store";
import { CragWithPermissions } from "types/utils";
import { getPermissions } from "$lib/cragRoles";
import { FaPen } from "react-icons/fa";
import Link from "next/link";
import { fetchError } from "$lib/toastOptions";

interface Props {
  crag: CragWithPermissions;
}

const Page = ({ crag }: Props) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + crag.id + "/comments"
  );
  const { mutate } = useSWRConfig();

  return (
    <CragContext.Provider value={crag}>
      <Flex direction="column" align="center">
        <Flex>
          <Heading>{crag.name}</Heading>
          {crag?.permissions && (
            <Link href={"/crags/" + crag.id + "/edit"}>
              <IconButton aria-label="edit">
                <FaPen />
              </IconButton>
            </Link>
          )}
        </Flex>

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
              try {
                const url = "/api/crags/" + crag.id + "/comments";
                const res = await axios.post(url, { body: data });

                await mutate(url);
              } catch (error) {
                toast({
                  ...fetchError,
                  description: error?.response.data || error?.message,
                });
              }
            }}
          />
        )}
        <Comments data={comments} error={commentsError} />
      </Flex>
    </CragContext.Provider>
  );
};

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const { cragId } = query;
  const session = await getSession({ req });

  const crag = await prisma.crag.findUnique({ where: { id: Number(cragId) } });

  if (!crag) {
    return {
      notFound: true,
    };
  }

  // TODO: This will probably error out if user has no perms
  const permissions = await getPermissions(Number(cragId), session.user.id);

  return {
    props: {
      fallback: {},
      crag: { ...crag, permissions },
    },
  };
};

export default Page;
