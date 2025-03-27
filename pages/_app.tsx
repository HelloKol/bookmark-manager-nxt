import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppProvider } from "@/context/AppProvider";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/components/app/AppLayout";

// Create a client with better defaults for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAppRoute = router.pathname.startsWith("/app");
  const isMarketingDomain = router.pathname.startsWith("/marketing");

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className={isMarketingDomain ? "marketing" : "app"}>
          {isAppRoute ? (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
        <ToastContainer />
      </AppProvider>
    </QueryClientProvider>
  );
}
