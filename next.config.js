/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
}

module.exports = nextConfig

// next.config.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/<repository>/' : '',
  images: {
    loader: 'imgix',
    path: '',
  },
  basePath: isProd ? '/<repository>' : '',
}
