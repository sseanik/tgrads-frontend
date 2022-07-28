/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'default',
    domains: ['res.cloudinary.com', 'image-charts.com', 'media.giphy.com'],
  },
  swcMinify: true,
};

module.exports = nextConfig;