/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Tối ưu hóa cho production
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
