import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
