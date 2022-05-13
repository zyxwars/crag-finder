import { withIronSessionSsr } from "iron-session/next";
import type { NextPage } from "next";
import Link from "next/link";
import Crags from "../components/Crags";
import { withAuthSsr } from "../lib/middleware/withAuthSsr";
import prisma from "../lib/prisma";
import { sessionOptions } from "../lib/session";

interface Props {
  session: any;
  fallback: any;
}

const Home: NextPage<Props> = ({ session }) => {
  return (
    <main>
      {session && (
        <>
          <Link href="/crag/create">
            <a>Create a new crag</a>
          </Link>
        </>
      )}

      <Crags />
    </main>
  );
};

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const session = await withAuthSsr(req);

  const crags = await prisma.crag.findMany();

  return {
    props: {
      session: session,
      fallback: {
        "/api/crag/recommended": crags,
      },
    },
  };
}, sessionOptions);

export default Home;
