/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tối ưu hóa cho production
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
