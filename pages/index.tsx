import type { NextPage } from "next";
import useSWR from "swr";
import prisma from "../lib/prisma";

const Home: NextPage = () => {
  const { data: crags, error: cragsError } = useSWR("/api/crag/recommended");

  return (
    <main>
      <div>Crags:</div>
      {cragsError ? (
        <div>Error loading crags: {cragsError.message}</div>
      ) : !crags ? (
        <div>Loading...</div>
      ) : (
        <>
          {crags.map((crag: any) => (
            <div key={crag.id}>{crag.name}</div>
          ))}
        </>
      )}
    </main>
  );
};

export const getServerSideProps = async () => {
  const crags = await prisma.crag.findMany();

  return {
    props: {
      fallback: {
        "/api/crag/recommended": crags,
      },
    },
  };
};

export default Home;
