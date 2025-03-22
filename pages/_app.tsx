import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppProvider } from "@/context/AppProvider";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isMarketingDomain = router.pathname.startsWith("/marketing");

  return (
    <AppProvider>
      <div className={isMarketingDomain ? "marketing" : "app"}>
        <Component {...pageProps} />
      </div>
      <ToastContainer />
    </AppProvider>
  );
}
