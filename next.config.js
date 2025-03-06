/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com', 'media.api-sports.io'],
  },
};

module.exports = nextConfig;