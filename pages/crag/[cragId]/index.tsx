import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate, unstable_serialize } from "swr";
import CragDetail from "../../../components/CragDetail";
import Visits from "../../../components/Visits";
import prisma from "../../../lib/prisma";

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

export const getServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext) => {
  const crag = await prisma.crag.findUnique({
    where: { id: Number(params?.cragId) },
  });

  return {
    props: {
      fallback: {
        [unstable_serialize("/api/crag/" + Number(params?.cragId))]: crag,
      },
    },
  };
};

export default Crag;
