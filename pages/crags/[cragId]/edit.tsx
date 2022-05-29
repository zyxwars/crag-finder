import FetchError from "$components/FetchError";
import { Box, Spinner } from "@chakra-ui/react";
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

interface Props {
  crag: CragWithPermissions;
}

const Page = ({ crag }: Props) => {
  const router = useRouter();
  const { data: comments, error: commentsError } = useSWR(
    "/api/crags/" + crag.id + "/comments"
  );

  return (
    <CragContext.Provider value={crag}>
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
