import { Photo, Visit } from "@prisma/client";
import Image from "next/image";
import React from "react";

type VisitWithPhotos = Visit & {
  photos: Photo[];
};

interface Props {
  visits: VisitWithPhotos[];
}

const Visits = ({ visits }: Props) => {
  return (
    <div>
      Visits:
      {visits.map((visit) => (
        <>
          {visit.photos.map((photo) => (
            <Image
              src={"/api/uploads/" + photo.path}
              width={100}
              height={100}
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Visits;
