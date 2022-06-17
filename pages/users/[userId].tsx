import FetchError from "$components/FetchError";
import { getPublicUser } from "$lib/db/queries";
import prisma from "$lib/db/prisma";
import { redirectSsr } from "$lib/redirectSsr";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Image from "next/image";
import { PublicUser } from "$lib/db/selectors";

const Page = () => {
  const router = useRouter();

  const { data: user, error: userError } = useSWR<PublicUser, any>(
    "/api/users/" + router.query.userId
  );

  if (userError) return <FetchError error={userError} />;

  if (!user)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <Flex align="center" direction="column">
      <Heading>{user.name}</Heading>
      <Image
        width="100"
        height="100"
        alt="avatar"
        src={"/api/uploads/" + user.avatar?.newFilename}
      />
    </Flex>
  );
};

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const { userId } = query;
  const session = await getSession({ req });

  if (!session) return redirectSsr(res, "/api/auth/signin");

  const user = await getPublicUser(Number(userId));

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      fallback: {
        ["/api/users/" + user.id]: user,
      },
    },
  };
};

export default Page;
