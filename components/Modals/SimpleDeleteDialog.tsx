import { fetchError } from "$lib/toastOptions";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { mutate } from "swr";
import React, { ReactElement, RefObject, useRef } from "react";

const SimpleDeleteDialog = ({
  isOpen,
  onClose,
  onSubmit,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactElement[];
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          {children}

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onSubmit} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default SimpleDeleteDialog;
