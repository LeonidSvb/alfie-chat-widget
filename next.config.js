/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable iframe embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
  
  // Optimize for widget embedding
  compress: true,
  
  // Configure for flexible deployment
  trailingSlash: false,
  
  // Configure images for widget context
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;