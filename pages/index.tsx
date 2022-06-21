import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import Crags from "$components/Crags";
import prisma from "$lib/db/prisma";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { Box, Button } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { getAllCrags } from "$lib/db/queries";
import Search from "$components/Search";

interface Props {
  session: Session | null;
}

const Home: NextPage<Props> = ({ session }) => {
  const { data, error } = useSWR("/api/crags");

  return (
    <>
      {session && (
        <>
          <Link href="/crags/create">
            <Button pos="fixed" bottom="25px" right="25px">
              Create a new crag
            </Button>
          </Link>
        </>
      )}

      <Search />
      <Crags data={data} error={error} />
    </>
  );
};

export const getServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  const crags = await getAllCrags();

  return {
    props: {
      session,
      fallback: {
        "/api/crags": crags,
      },
    },
  };
};

export default Home;
