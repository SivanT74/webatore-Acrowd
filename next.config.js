const dotenv = require('dotenv');
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: '', // Set this if your project is served from a subdirectory, otherwise leave as ''
  assetPrefix: '', // Set this to the URL where your assets are hosted, otherwise leave as ''
  env: {
    NEXT_PUBLIC_CONSUMER_KEY: process.env.NEXT_PUBLIC_CONSUMER_KEY,
    NEXT_PUBLIC_CONSUMER_SECRET: process.env.NEXT_PUBLIC_CONSUMER_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
