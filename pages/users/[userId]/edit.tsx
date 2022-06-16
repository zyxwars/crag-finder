import FetchError from "$components/FetchError";
import ImageUpload from "$components/ImageUpload";
import { fetchError } from "$lib/toastOptions";
import { Box, Spinner, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import useSWR, { useSWRConfig } from "swr";

const Page = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const toast = useToast();

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
      <ImageUpload
        options={{ maxFiles: 1 }}
        onPost={async (files) => {
          const formData = new FormData();
          formData.append("avatar", files[0]);

          try {
            const url = "/api/users/" + user.id + "/avatar";
            const res = await axios.post(url, formData);

            await mutate(url);
          } catch (error: any) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }
        }}
      />
    </div>
  );
};

export const getServerSideProps = async () => {
  // TODO: query the user and check permissions
  return { props: { fallback: {} } };
};

export default Page;
