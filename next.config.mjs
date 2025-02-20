import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
    reactStrictMode: true,
    swcMinify: true,
    productionBrowserSourceMaps: true,
    webpack: (config) => {
        config.devtool = 'source-map';
        return config;
    },
});

export default nextConfig;
