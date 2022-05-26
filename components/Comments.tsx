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

  const rootComments = data.filter((comment) => comment.parentId === null);

  return (
    <Box>
      {rootComments.map((comment) => (
        <Comment key={comment.id} comment={comment} comments={data} />
      ))}
    </Box>
  );
};

export default Comments;
