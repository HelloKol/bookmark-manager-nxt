import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
});
