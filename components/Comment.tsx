import React, { useState, ChangeEvent } from "react";
import { CommentWithAuthor } from "types/utils";
import {
  Text,
  Box,
  Spinner,
  Flex,
  Button,
  Spacer,
  Input,
  InputGroup,
  InputLeftAddon,
  ButtonGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

interface Props {
  comment: CommentWithAuthor;
  comments: CommentWithAuthor[];
}

const Comment = ({ comment, comments }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const { mutate } = useSWRConfig();
  const router = useRouter();
  const replies = comments.filter((reply) => reply.parentId === comment.id);

  return (
    <Box my="0.5rem">
      <Text fontSize="sm">{comment.author.name}</Text>
      <Flex align="center">
        <Text>{comment.body}</Text>
        <Spacer />
        {!showReply && (
          <Button onClick={() => setShowReply(true)}>Reply</Button>
        )}
      </Flex>

      {showReply && (
        <>
          <InputGroup>
            <InputLeftAddon>@{comment.author.name}</InputLeftAddon>
            <Input
              placeholder="Reply"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setReply(e.target.value)
              }
            />
          </InputGroup>
          <Flex align="center">
            <Spacer />
            <ButtonGroup>
              <Button
                onClick={async () => {
                  const url =
                    "/api/crags/" +
                    router.query.cragId +
                    "/comments/" +
                    comment.id;

                  const res = await axios.post(url, {
                    body: reply,
                  });

                  await mutate(url);
                }}
              >
                Post
              </Button>
              <Button
                onClick={() => {
                  setShowReply(false);
                  setReply("");
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      )}

      <Box ml="2rem">
        {replies.map((comment) => (
          <Comment key={comment.id} comment={comment} comments={comments} />
        ))}
      </Box>
    </Box>
  );
};

export default Comment;
