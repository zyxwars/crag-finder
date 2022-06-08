import { fetchError } from "$lib/toastOptions";
import {
  Flex,
  Box,
  IconButton,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import { CragContext } from "store";
import { useSWRConfig } from "swr";

const CreateVisit = () => {
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const crag = useContext(CragContext);

  const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPhotosToUpload([...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
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
        {photosToUpload.map((file, i) => (
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
                setPhotosToUpload((photosToUpload) =>
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
        onClick={async () => {
          const formData = new FormData();
          photosToUpload.forEach((photo) => formData.append("photos", photo));

          try {
            const url = "/api/crags/" + crag.id + "/visits";
            const res = await axios.post(url, formData);

            await mutate(url);
            setPhotosToUpload([]);
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
    </Flex>
  );
};

export default CreateVisit;
