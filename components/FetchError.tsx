import { AxiosError } from "axios";
import React from "react";

interface Props {
  error: any;
}

const FetchError = ({ error }: Props) => {
  return (
    <div>
      <div>{error?.message}</div>
      <div>Server response {error?.response?.data}</div>
    </div>
  );
};

export default FetchError;
