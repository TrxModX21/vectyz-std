import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      new URL("https://res.cloudinary.com/dqwbgsznu/image/upload/**"),
    ],
  },
};

export default nextConfig;
