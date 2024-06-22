/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['shop-interview.acrowd.se'], // Allow images from this domain
    unoptimized: true,
  },
  basePath: '', 
  assetPrefix: '', 
};

module.exports = nextConfig;
