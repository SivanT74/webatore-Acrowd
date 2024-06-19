/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out', // Default is .next, but 'out' is common for export
  images: {
    unoptimized: true,
  },
  basePath: '', // Set this if your GitHub Pages project is in a subdirectory
  assetPrefix: './', // Ensure relative paths
}

module.exports = nextConfig;