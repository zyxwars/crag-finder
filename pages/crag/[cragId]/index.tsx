import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR, { mutate, unstable_serialize } from "swr";
import CragDetail from "../../../components/CragDetail";
import CreateVisit from "../../../components/CreateVisit";
import Visits from "../../../components/Visits";
import { withAuthSsr } from "../../../lib/middleware/withAuthSsr";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

const Crag = () => {
  const router = useRouter();
  const { cragId } = router.query;

  const { data: crag, error: cragError } = useSWR("/api/crag/" + cragId);

  const {
    data: visits,
    error: visitsError,
    mutate: mutateVisits,
  } = useSWR("/api/crag/" + cragId + "/visits");

  return (
    <>
      <CragDetail data={crag} error={cragError} />
      <Visits data={visits} error={visitsError} />

      <Link href={"/visit/create?cragId=" + cragId}>
        <a>Post visit</a>
      </Link>
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, params }) => {
    const session = await withAuthSsr(req);

    const crag = await prisma.crag.findUnique({
      where: { id: Number(params?.cragId) },
    });

    return {
      props: {
        session,
        fallback: {
          [unstable_serialize("/api/crag/" + Number(params?.cragId))]: crag,
        },
      },
    };
  },
  sessionOptions
);

export default Crag;
