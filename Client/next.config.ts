/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations for aaPanel deployment
  output: 'standalone',
  compress: true,
  poweredByHeader: false,

  eslint: {
    // build yoki start paytida ESLint tekshiruvini butunlay o‘chiradi
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'zenlyserver.test',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zenlyserver.test',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.zenly.uz',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 31536000, // 1 year for production
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'antd'],
  },
}

module.exports = nextConfig