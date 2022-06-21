import { Box } from "@chakra-ui/react";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import Navbar from "./Navbar";

function Layout({ children }: { children: ReactElement }) {
  return (
    <Box height="100vh">
      <Navbar />
      <Box p="1rem">{children}</Box>
    </Box>
  );
}
export default Layout;
