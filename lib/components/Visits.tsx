import { Photo, Visit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SWRError from "./SWRError";

type VisitWithPhotos = Visit & {
  photos: Photo[];
};

interface Props {
  data: VisitWithPhotos[];
  error: any;
}

const Visits = ({ data, error }: Props) => {
  if (error) return <SWRError error={error} />;

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((visit) => (
        <Link key={visit.id} href={"/visit/" + visit.id}>
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
        </Link>
      ))}
    </div>
  );
};

export default Visits;
