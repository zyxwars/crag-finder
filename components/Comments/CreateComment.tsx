import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

interface Props {
  onPost: (data: string) => void;
}

const CreateComment = ({ onPost }: Props) => {
  const [comment, setComment] = useState("");

  return (
    <Box>
      <Input
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setComment(e.target.value)
        }
        placeholder="Post comment"
      />

      <Button
        onClick={() => {
          onPost(comment);

          setComment("");
        }}
      >
        Post
      </Button>
    </Box>
  );
};

export default CreateComment;
