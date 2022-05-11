import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR, { unstable_serialize } from "swr";
import { withAuthSsr } from "../../../lib/middleware/withAuthSsr";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

const Crag = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: crag, error } = useSWR("/api/crag/" + id);

  return (
    <>
      {crag && (
        <>
          <div>{crag.name}</div>
          <article className="prose">
            <ReactMarkdown>{crag.content}</ReactMarkdown>
          </article>
        </>
      )}
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, params }) => {
    const session = await withAuthSsr(req);

    //@ts-ignore The iron session typing broke this
    const { id } = params;

    const crag = await prisma.crag.findUnique({ where: { id: Number(id) } });

    return {
      props: {
        session,
        fallback: {
          [unstable_serialize(["api", "crag", id])]: crag,
        },
      },
    };
  },
  sessionOptions
);

export default Crag;