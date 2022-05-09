import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { withAuthSsr } from "../lib/middleware/withAuthSsr";
import prisma from "../lib/prisma";
import { sessionOptions } from "../lib/session";

interface Props {
  session: any;
}

const Home: NextPage<Props> = ({ session }) => {
  const { data: crags, error: cragsError } = useSWR("/api/crag/recommended");
  const router = useRouter();

  return (
    <main>
      {session && (
        <>
          <button
            onClick={async () => {
              try {
                await axios.post("/api/auth/logout");
                router.push("/auth/login");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Logout
          </button>
        </>
      )}
      <div>Crags:</div>
      {cragsError ? (
        <div>Error loading crags: {cragsError.message}</div>
      ) : !crags ? (
        <div>Loading...</div>
      ) : (
        <>
          {crags.map((crag: any) => (
            <Link key={crag.id} href={"/crag/" + crag.id}>
              <a>{crag.name}</a>
            </Link>
          ))}
        </>
      )}
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
