import React, { useState, ChangeEvent, useContext } from "react";
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
import { CommentsContext } from "./Comments";
import { useSession } from "next-auth/react";
import { CragContext } from "store";

interface Props {
  comment: CommentWithAuthor;
}

const Comment = ({ comment }: Props) => {
  const crag = useContext(CragContext);
  const comments = useContext(CommentsContext);
  const { mutate } = useSWRConfig();
  const { data: session, status } = useSession();

  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const replies = comments.filter((reply) => reply.parentId === comment.id);

  const handleCancelReply = () => {
    setShowReply(false);
    setReply("");
  };

  return (
    <Box my="0.5rem">
      <Text fontSize="sm">{comment.author.name}</Text>
      <Flex align="center">
        <Text>{comment.body}</Text>
        <Spacer />
        {!showReply &&
          status === "authenticated" &&
          !crag?.permissions?.deleteComments && (
            <Button onClick={() => setShowReply(true)}>Reply</Button>
          )}
        {(session?.user.id === comment.authorId ||
          crag?.permissions?.deleteComments) && (
          <Button
            onClick={async () => {
              const url = "/api/crags/" + crag.id + "/comments";
              const res = await axios.delete(url + "/" + comment.id);
              await mutate(url);
            }}
          >
            Delete
          </Button>
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
                  const url = "/api/crags/" + crag.id + "/comments";
                  const res = await axios.post(url + "/" + comment.id, {
                    body: reply,
                  });
                  await mutate(url);
                  handleCancelReply();
                }}
              >
                Post
              </Button>
              <Button onClick={handleCancelReply}>Cancel</Button>
            </ButtonGroup>
          </Flex>
        </>
      )}

      <Box ml="2rem">
        {replies.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default Comment;
