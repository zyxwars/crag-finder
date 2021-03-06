import { Text, Box, Spinner, Flex } from "@chakra-ui/react";
import React, { useContext } from "react";
import { createContext } from "react";
import { CommentWithAuthor } from "types/utils";
import Comment from "./Comment";
import FetchError from "../FetchError";
import { CragContext } from "store";

interface Props {
  data: CommentWithAuthor[];
  error: any;
}

export const CommentsContext = createContext<CommentWithAuthor[]>();

const Comments = ({ data, error }: Props) => {
  const crag = useContext(CragContext);

  if (error) return <FetchError error={error} />;

  if (!data)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  const rootComments = data.filter((comment) => comment.parentId === null);

  return (
    <CommentsContext.Provider value={data}>
      <Box>
        {rootComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            canDelete={!!crag.permissions?.deleteComments}
          />
        ))}
      </Box>
    </CommentsContext.Provider>
  );
};

export default Comments;
