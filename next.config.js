/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'default',
    domains: [
      'res.cloudinary.com',
      'image-charts.com',
      'media.giphy.com',
      'media1.tenor.com',
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
