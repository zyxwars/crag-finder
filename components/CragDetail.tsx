import { Crag } from "@prisma/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";
import SWRError from "./SWRError";

interface Props {
  id: Number;
}

const CragDetail = ({ id }: Props) => {
  const { data, error } = useSWR("/api/crag/" + id);

  if (error) return <SWRError error={error} />;

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div>{data.name}</div>
      <article className="prose">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </article>
    </>
  );
};

export default CragDetail;
