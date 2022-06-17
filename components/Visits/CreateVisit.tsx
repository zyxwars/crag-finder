import ImageUpload from "$components/ImageUpload";
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

  return (
    <ImageUpload
      onPost={async (files) => {
        const formData = new FormData();
        files.forEach((photo) => formData.append("photos", photo));

        try {
          const url = "/api/crags/" + crag.id + "/visits";
          const res = await axios.post(url, formData);

          await mutate(url);
        } catch (error) {
          toast({
            ...fetchError,
            description: error?.response.data || error?.message,
          });
        }
      }}
    />
  );
};

export default CreateVisit;
