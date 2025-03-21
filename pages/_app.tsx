import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "@/context/AppProvider";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AppProvider>
  );
}
