import FetchError from "$components/FetchError";
import { Box, Spinner, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const Page = () => {
  const router = useRouter();

  const { data: user, error: userError } = useSWR(
    "/api/users/" + router?.query?.userId + "/private/"
  );

  if (userError) return <FetchError error={userError} />;

  if (!user)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <div>
      <Heading>{user.name}</Heading>
    </div>
  );
};

export const getServerSideProps = async () => {
  // TODO: query the user and check permissions
  return { props: { fallback: {} } };
};

export default Page;
