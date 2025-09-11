/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable iframe embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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

  // Exclude backup folders from build
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib/airtable': false, // Prevent importing deleted airtable lib
    };
    return config;
  },
};

module.exports = nextConfig;