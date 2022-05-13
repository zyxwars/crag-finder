import { Photo, Visit } from "@prisma/client";
import Image from "next/image";
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
