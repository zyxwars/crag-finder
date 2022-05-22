import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider>
        <SWRConfig
          value={{
            fetcher: (url) => axios.get(url).then((res) => res.data),
            fallback: pageProps?.fallback,
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
