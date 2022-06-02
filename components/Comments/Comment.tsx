import React, { useState, ChangeEvent, useContext, useRef } from "react";
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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { CommentsContext } from "./Comments";
import { useSession } from "next-auth/react";
import { CragContext } from "store";
import { fetchError } from "$lib/toastOptions";

interface Props {
  comment: CommentWithAuthor;
  canDelete: boolean;
}

const Comment = ({ comment, canDelete }: Props) => {
  const crag = useContext(CragContext);
  const comments = useContext(CommentsContext);
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const { data: session, status } = useSession();

  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const replies = comments.filter((reply) => reply.parentId === comment.id);

  const handleCancelReply = () => {
    setShowReply(false);
    setReply("");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Comment
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  try {
                    const url = "/api/crags/" + crag.id + "/comments";
                    const res = await axios.delete(url + "/" + comment.id);
                    await mutate(url);
                  } catch (error) {
                    toast({
                      ...fetchError,
                      description: error?.response.data || error?.message,
                    });
                  }

                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box my="0.5rem">
        <Text fontSize="sm">{comment.author.name}</Text>
        <Flex align="center">
          <Text>{comment.body}</Text>
          <Spacer />
          {!showReply && status === "authenticated" && (
            <Button onClick={() => setShowReply(true)}>Reply</Button>
          )}
          {(session?.user.id === comment.authorId || canDelete) && (
            <Button onClick={onOpen}>Delete</Button>
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
                    try {
                      const url = "/api/crags/" + crag.id + "/comments";
                      const res = await axios.post(url + "/" + comment.id, {
                        body: reply,
                      });
                      await mutate(url);
                      handleCancelReply();
                    } catch (error) {
                      toast({
                        ...fetchError,
                        description: error?.response.data || error?.message,
                      });
                    }
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
            <Comment key={comment.id} comment={comment} canDelete={canDelete} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Comment;
