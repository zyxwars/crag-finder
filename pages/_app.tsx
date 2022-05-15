import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default MyApp;
