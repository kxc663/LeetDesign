/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add rule to exclude problematic HTML files from being processed
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html$/,
      loader: 'null-loader',
      resourceQuery: { not: [/raw/] }, // Exclude from raw loader
    });
    
    // Handle Node.js modules on client-side
    if (!isServer) {
      // Fallback for 'fs' and other Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        dns: false,
        os: false,
        path: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
