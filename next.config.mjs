/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
};

export default nextConfig;
