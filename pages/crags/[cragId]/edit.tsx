import FetchError from "$components/FetchError";
import {
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  IconButton,
  Spinner,
  useEditableControls,
  Text,
  Button,
  useToast,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import prisma from "$lib/db/prisma";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { createContext, useState } from "react";
import useSWR, { mutate, unstable_serialize, useSWRConfig } from "swr";
import { Crag } from "@prisma/client";
import { getSession } from "next-auth/react";
import { CragPermissions, getPermissions } from "$lib/cragRoles";
import { redirectSsr } from "$lib/redirectSsr";
import Comments from "$components/Comments/Comments";
import { CragWithPermissions } from "types/utils";
import { CragContext } from "store";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";
import axios from "axios";
import { fetchError } from "$lib/toastOptions";
import DeleteCragDialog from "$components/Modals/DeleteCragDialog";
import { getCragWithPermissions } from "$lib/db/queries";

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        aria-label="Submit"
        icon={<FaCheck />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label="cancel"
        icon={<FaTimes />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton
        aria-label="edit"
        size="sm"
        icon={<FaPen />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
}

const Page = () => {
  const router = useRouter();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + router.query.cragId + "/comments"
  );

  const url = "/api/crags/" + router.query.cragId;
  const { data: crag, error: cragError } = useSWR(
    "/api/crags/" + router.query.cragId
  );
  const { mutate } = useSWRConfig();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  if (cragError) return <FetchError error={cragError} />;

  if (!crag)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <CragContext.Provider value={crag}>
      <DeleteCragDialog crag={crag} isOpen={isOpen} onClose={onClose} />

      <Button isDisabled={!crag.permissions?.deleteCrag} onClick={onOpen}>
        Delete crag
      </Button>

      <Editable
        defaultValue={crag.name}
        isDisabled={!crag?.permissions?.name}
        onSubmit={async (data: string) => {
          try {
            const res = await axios.put(url, { name: data });
            await mutate(url);
          } catch (error) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }
        }}
      >
        <Heading as={EditablePreview} />
        <EditableInput />
        <EditableControls />
      </Editable>

      <Text>Body</Text>
      <Editable
        defaultValue={crag.body}
        isDisabled={!crag?.permissions?.body}
        onSubmit={async (data: string) => {
          try {
            const res = await axios.put(url, { body: data });
            await mutate(url);
          } catch (error) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }
        }}
      >
        <EditablePreview />
        <EditableTextarea />
        <EditableControls />
      </Editable>

      <Text>Tags</Text>
      <Editable
        defaultValue={crag.tags}
        isDisabled={!crag?.permissions?.tags}
        onSubmit={async (data: string) => {
          try {
            const res = await axios.put(url, { tags: data });
            await mutate(url);
          } catch (error) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }
        }}
      >
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </Editable>

      {crag.permissions?.deleteComments && (
        <Comments data={comments} error={commentsError} />
      )}
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
  if (!session) return redirectSsr(res, "/api/auth/signin");

  const crag = await getCragWithPermissions(Number(cragId), session);

  if (!crag) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      fallback: {
        ["/api/crags/" + crag.id]: crag,
      },
    },
  };
};
export default Page;
