import SimpleDeleteDialog from "$components/Modals/SimpleDeleteDialog";
import { fetchError } from "$lib/toastOptions";
import {
  Text,
  Box,
  Flex,
  IconButton,
  AlertDialogBody,
  AlertDialogHeader,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { CragContext } from "store";
import { useSWRConfig } from "swr";
import { VisitWithAuthorPhotos } from "types/utils";

const Visit = ({ visit }: { visit: VisitWithAuthorPhotos }) => {
  const { data: session, status } = useSession();
  const crag = useContext(CragContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate } = useSWRConfig();

  return (
    <>
      <SimpleDeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={async () => {
          try {
            const url = "/api/crags/" + crag.id + "/visits";
            const res = await axios.delete(url + "/" + visit.id);
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
          Delete Visit
        </AlertDialogHeader>
        <AlertDialogBody>Are you sure?</AlertDialogBody>
      </SimpleDeleteDialog>

      <Box>
        <Flex direction="column">
          <Text>{visit.author.name}</Text>
          <Flex>
            {visit.photos.map((photo) => (
              <Image
                key={photo.id}
                src={"/api/uploads/" + photo.newFilename}
                alt={photo.originalFilename}
                width={100}
                height={100}
              />
            ))}
          </Flex>
          {(visit.authorId === session?.user.id ||
            crag?.permissions?.deleteVisit) && (
            <IconButton aria-label="delete visit" onClick={onOpen}>
              <FaTrash />
            </IconButton>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default Visit;
