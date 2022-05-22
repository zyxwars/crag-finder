import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import Crags from "$components/Crags";
import prisma from "$lib/prisma";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Home: NextPage<Props> = ({ session }) => {
  const { data, error } = useSWR("/api/crags");

  return (
    <main>
      {session && (
        <>
          <Link href="/crags/create">
            <a>Create a new crag</a>
          </Link>
        </>
      )}

      <Crags data={data} error={error} />
    </main>
  );
};
export const getServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  const crags = await prisma.crag.findMany();

  return {
    props: {
      session,
      fallback: {
        "/api/crag/recommended": crags,
      },
    },
  };
};

export default Home;
