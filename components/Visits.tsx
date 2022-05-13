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
        <div key={visit.id}>
          {visit.id}
          {visit.photos.map((photo) => (
            <Image
              key={photo.id}
              src={"/api/uploads/" + photo.path}
              width={100}
              height={100}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Visits;
