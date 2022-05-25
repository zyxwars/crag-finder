import { Text, Box, Spinner, Flex } from "@chakra-ui/react";
import React from "react";
import { CommentWithAuthor } from "types/utils";
import Comment from "./Comment";
import FetchError from "./FetchError";

interface Props {
  data: CommentWithAuthor[];
  error: any;
}

const Comments = ({ data, error }: Props) => {
  if (error) return <FetchError error={error} />;

  if (!data)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  return (
    <Box>
      {data.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default Comments;
