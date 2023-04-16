/** @type {import('next').NextConfig} */
const { i18n } = require('./i18n.config');
const nextConfig = {
    i18n,
    reactStrictMode: false,
    swcMinify: true,
    env: {
        HOST_NAME_API: process.env.HOST_NAME_API,
        HOST_NAME_REDIRECT: process.env.HOST_NAME_REDIRECT,
    },
};

module.exports = nextConfig;
