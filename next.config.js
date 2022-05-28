/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['static.vecteezy.com', 'avatars.githubusercontent.com'],
    },
    experimental: {
        images: {
            layoutRaw: true,
        },
    },
};

module.exports = nextConfig;
