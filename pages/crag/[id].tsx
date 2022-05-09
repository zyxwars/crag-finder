import { Crag, Prisma } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import { withAuthSsr } from "../../lib/middleware/withAuthSsr";
import prisma from "../../lib/prisma";
import { sessionOptions } from "../../lib/session";

interface Props {
  crag: Crag;
}

const Crag = ({ crag }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <div>{crag.name}</div>
      <article className="prose">
        <ReactMarkdown>{crag.content}</ReactMarkdown>
      </article>
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
        crag,
      },
    };
  },
  sessionOptions
);

export default Crag;
