/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  images: {
    unopimized: true,
  }
}

module.exports = nextConfig
