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
      new URL("https://lh3.googleusercontent.com/**"),
      new URL("https://via.placeholder.com/**")
    ],
  },
};

export default nextConfig;
