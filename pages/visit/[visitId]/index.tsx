import { Photo, Visit } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import React from "react";
import prisma from "../../../lib/prisma";

type VisitWithPhotos = Visit & {
  photos: Photo[];
};

interface Props {
  visit: VisitWithPhotos;
}

const Visit = ({ visit }: Props) => {
  return (
    <div>
      {visit.description}
      {visit.photos.map((photo) => (
        <Image
          key={photo.id}
          src={"/api/uploads/" + photo.path}
          width={100}
          height={100}
          alt={photo.name}
        />
      ))}
    </div>
  );
};

export default Visit;

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const visit = await prisma.visit.findUnique({
    where: { id: Number(params?.visitId) },
    include: { photos: true },
  });

  if (!visit) return { notFound: true };

  return { props: { visit } };
};
