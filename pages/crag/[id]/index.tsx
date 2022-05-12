import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR, { unstable_serialize } from "swr";
import CreateVisit from "../../../components/CreateVisit";
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
          {crag.visits &&
            crag.visits.map((visit: any) => (
              <>
                {visit.photos.map((photo: any) => (
                  <Image src={"/api/static/" + photo.path} layout="fill" />
                ))}
              </>
            ))}

          <CreateVisit
            onSubmit={(data) => {
              try {
                Array.from(data.photos).forEach(async (photo) => {
                  const formData = new FormData();
                  formData.set("photo", photo);

                  const res = await axios.post(
                    "/api/crag/" + crag.id + "/visit",
                    formData
                  );
                });

                // TODO: Reload swr
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </>
      )}
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, params }) => {
    const session = await withAuthSsr(req);

    const crag = await prisma.crag.findUnique({
      where: { id: Number(params?.id) },
      include: { visits: { select: { photos: true } } },
    });

    return {
      props: {
        session,
        fallback: {
          [unstable_serialize(["api", "crag", params?.id])]: crag,
        },
      },
    };
  },
  sessionOptions
);

export default Crag;
