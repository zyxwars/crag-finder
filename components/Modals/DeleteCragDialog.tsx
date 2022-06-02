import { fetchError } from "$lib/toastOptions";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  useToast,
  useDisclosure,
  Text,
  Box,
  FormControl,
  FormErrorMessage,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { CragWithPermissions } from "types/utils";

interface Inputs {
  name: string;
}

const DeleteCragDialog = ({
  crag,
  isOpen,
  onClose,
}: {
  crag: CragWithPermissions;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await axios.delete("/api/crags/" + router.query.cragId);

      await router.push("/");
    } catch (error) {
      toast({
        ...fetchError,
        description: error?.response.data || error?.message,
      });
    }
  });

  const cancelRef = useRef<HTMLDivElement>(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {"Type '" + crag.name + "' to confirm delete"}
          </AlertDialogHeader>

          <form onSubmit={onSubmit}>
            <AlertDialogBody>
              <FormControl isInvalid={!!errors.name}>
                <Input
                  placeholder="Type the crag's name"
                  {...register("name", {
                    required: "Type the crag's name as confirmation",
                    validate: (name) =>
                      name === crag.name
                        ? true
                        : "Type the crag's name as confirmation",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="red"
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteCragDialog;
