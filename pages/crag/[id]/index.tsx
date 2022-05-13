import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR, { unstable_serialize } from "swr";
import CragDetail from "../../../components/CragDetail";
import CreateVisit from "../../../components/CreateVisit";
import Visits from "../../../components/Visits";
import { withAuthSsr } from "../../../lib/middleware/withAuthSsr";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

const Crag = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: crag, error: cragError } = useSWR("/api/crag/" + id);

  const { data: visits, error: visitsError } = useSWR(
    "/api/crag/" + id + "/visits"
  );

  return (
    <>
      <CragDetail data={crag} error={cragError} />
      <Visits data={visits} error={visitsError} />

      <CreateVisit
        onSubmit={(data) => {
          try {
            Array.from(data.photos).forEach(async (photo) => {
              const formData = new FormData();
              formData.set("photo", photo);

              const res = await axios.post(
                "/api/crag/" + id + "/visit",
                formData
              );
            });

            // TODO: Refetch visits
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, params }) => {
    const session = await withAuthSsr(req);

    const crag = await prisma.crag.findUnique({
      where: { id: Number(params?.id) },
    });

    return {
      props: {
        session,
        fallback: {
          [unstable_serialize("/api/crag/" + Number(params?.id))]: crag,
        },
      },
    };
  },
  sessionOptions
);

export default Crag;
