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

interface Props {
  comment: CommentWithAuthor;
}

const Comment = ({ comment }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

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
                onClick={() => {
                  const res = axios.post("/api/comments/" + comment.id, {
                    body: reply,
                  });
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
    </Box>
  );
};

export default Comment;
