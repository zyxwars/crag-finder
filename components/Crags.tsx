import { Crag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import SWRError from "./SWRError";

const Crags = () => {
  const { data, error } = useSWR("/api/crag/recommended");

  if (error) return <SWRError error={error} />;

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      Crags:
      <div className="flex flex-col">
        {data.map((crag: Crag) => (
          <Link key={crag.id} href={"/crag/" + crag.id}>
            <a>{crag.name}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Crags;
