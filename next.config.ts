import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // Vercel Blob (uploaded blog images)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      // Memorable shortcut to the admin panel.
      { source: "/login", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
