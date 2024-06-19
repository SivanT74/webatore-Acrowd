/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '.next', // This is actually unnecessary because '.next' is the default
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig;