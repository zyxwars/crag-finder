import { fetchError } from "$lib/toastOptions";
import {
  Flex,
  Box,
  IconButton,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useCallback, useContext, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";

const ImageUpload = ({
  onPost,
  options,
}: {
  onPost: (files: File[]) => void;
  options?: DropzoneOptions;
}) => {
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImagesToUpload([...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    ...options,
  });

  return (
    <Flex justify="center" align="center" direction="column">
      <Box
        px="1rem"
        py="3rem"
        borderWidth="1px"
        borderRadius="lg"
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Box>
      <Box>
        {imagesToUpload.map((file, i) => (
          <Flex justify="space-between" align="center" key={file.name + i}>
            <Image
              // TODO: Fix memory leaks with revokeObjectURL
              src={URL.createObjectURL(file)}
              alt="file.name"
              width="100px"
              height="100px"
            />
            {file.name} - {file.size} bytes
            <IconButton
              aria-label="remove"
              onClick={() => {
                setImagesToUpload((photosToUpload) =>
                  photosToUpload.filter((photo) => photo !== file)
                );
              }}
            >
              <FaTimes />
            </IconButton>
          </Flex>
        ))}
      </Box>
      <Button
        onClick={() => {
          onPost(imagesToUpload);
          setImagesToUpload([]);
        }}
      >
        Post
      </Button>
    </Flex>
  );
};

export default ImageUpload;
