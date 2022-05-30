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
  Heading,
  Text,
} from "@chakra-ui/react";
import prisma from "$lib/prisma";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { createContext } from "react";
import useSWR from "swr";
import { Crag } from "@prisma/client";
import { getSession } from "next-auth/react";
import { CragPermissions, getPermissions } from "$lib/cragRoles";
import { redirectSsr } from "$lib/redirectSsr";
import Comments from "$components/Comments/Comments";
import { CragWithPermissions } from "types/utils";
import { CragContext } from "store";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";
import axios from "axios";

interface Props {
  crag: CragWithPermissions;
}

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton icon={<FaCheck />} {...getSubmitButtonProps()} />
      <IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="sm" icon={<FaPen />} {...getEditButtonProps()} />
    </Flex>
  );
}

const Page = ({ crag }: Props) => {
  const router = useRouter();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + crag.id + "/comments"
  );

  return (
    <CragContext.Provider value={crag}>
      <Text>Name</Text>
      <Editable
        defaultValue={crag.name}
        isDisabled={!crag?.permissions?.name}
        onChange={async (data) => {
          console.log(data);
        }}
      >
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </Editable>

      <Text>Body</Text>
      <Editable defaultValue={crag.body} isDisabled={!crag?.permissions?.body}>
        <EditablePreview />
        <EditableTextarea />
        <EditableControls />
      </Editable>

      <Text>Tags</Text>
      <Editable defaultValue={crag.tags} isDisabled={!crag?.permissions?.tags}>
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

  const crag = await prisma.crag.findUnique({ where: { id: Number(cragId) } });

  if (!crag) {
    return {
      notFound: true,
    };
  }

  const permissions = await getPermissions(Number(cragId), session.user.id);

  return {
    props: {
      fallback: {},
      crag: { ...crag, permissions },
    },
  };
};
export default Page;
