import React, { useState, ChangeEvent, useContext, useRef } from "react";
import { Author, CommentWithAuthor } from "types/utils";
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
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { CommentsContext } from "./Comments";
import { useSession } from "next-auth/react";
import { CragContext } from "store";
import { fetchError } from "$lib/toastOptions";
import { FaReply, FaTrash } from "react-icons/fa";
import SimpleDeleteDialog from "$components/Modals/SimpleDeleteDialog";

interface Props {
  comment: CommentWithAuthor;
  parentAuthor?: Author;
  canDelete: boolean;
}

const Comment = ({ comment, parentAuthor, canDelete }: Props) => {
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

  return (
    <>
      <SimpleDeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={async () => {
          try {
            const url = "/api/crags/" + crag.id + "/comments";
            const res = await axios.delete(url + "/" + comment.id);
            await mutate(url);
          } catch (error: any) {
            toast({
              ...fetchError,
              description: error?.response.data || error?.message,
            });
          }

          onClose();
        }}
      >
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete Comment
        </AlertDialogHeader>
        <AlertDialogBody>Are you sure?</AlertDialogBody>
      </SimpleDeleteDialog>

      <Box my="0.5rem">
        <Text fontSize="sm">{comment.author.name}</Text>
        <Flex align="center">
          {parentAuthor && (
            <Text mr="0.5rem" fontWeight="bold">
              @{parentAuthor.name}
            </Text>
          )}
          <Text>{comment.body}</Text>
          <Spacer />
          {!showReply && status === "authenticated" && (
            <IconButton
              aria-label="reply to comment"
              onClick={() => setShowReply(true)}
            >
              <FaReply />
            </IconButton>
          )}
          {(session?.user.id === comment.authorId || canDelete) && (
            <IconButton aria-label="delete comment" onClick={onOpen}>
              <FaTrash />
            </IconButton>
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
                    } catch (error: any) {
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
      </Box>

      {comment.parentId ? (
        replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            parentAuthor={comment.parentId ? comment.author : undefined}
            canDelete={canDelete}
          />
        ))
      ) : (
        <Box ml="2rem">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              parentAuthor={comment.parentId ? comment.author : undefined}
              canDelete={canDelete}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default Comment;
