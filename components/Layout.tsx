import { Box } from "@chakra-ui/react";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import Navbar from "./Navbar";

function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Navbar />
      <Box p="1rem">{children}</Box>
    </>
  );
}
export default Layout;
