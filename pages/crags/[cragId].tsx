import React, { createContext } from "react";
import { GetServerSidePropsContext } from "next";
import prisma from "$lib/prisma";
import { Crag } from "@prisma/client";
import {
  Box,
  Button,
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
import ChakraUIRenderer from "$lib/markdownRenderer";
import { useDropzone } from "react-dropzone";
import Visits from "$components/Visits/Visits";

interface Props {
  crag: CragWithPermissions;
}

const Page = ({ crag }: Props) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + crag.id + "/comments"
  );
  const { data: visits, error: visitsError } = useSWR(
    "/api/crags/" + crag.id + "/visits"
  );
  const { mutate } = useSWRConfig();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

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
          <ReactMarkdown components={ChakraUIRenderer()}>
            {crag.body}
          </ReactMarkdown>
        </Box>

        <Box>
          {crag.tags.split(",").map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </Box>

        <Heading>Visits</Heading>
        {status === "authenticated" && (
          <>
            <Box {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </Box>
            <Box>
              <h4>Files</h4>
              <ul>{files}</ul>
            </Box>
            <Button
              onClick={async () => {
                const formData = new FormData();
                acceptedFiles.forEach((file) =>
                  formData.append("photos", file)
                );

                try {
                  const url = "/api/crags/" + crag.id + "/visits";
                  const res = await axios.post(url, formData);

                  // TODO: mutate
                } catch (error) {
                  toast({
                    ...fetchError,
                    description: error?.response.data || error?.message,
                  });
                }
              }}
            >
              Post
            </Button>
          </>
        )}
        <Visits data={visits} error={visitsError} />

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
