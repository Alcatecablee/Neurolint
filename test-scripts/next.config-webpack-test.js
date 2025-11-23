/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  
  // Webpack customization (should be detected by Turbopack migration assistant)
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CUSTOM_VAR': JSON.stringify('value'),
      })
    );
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './components',
    };
    
    return config;
  },
  
  // Experimental features
  experimental: {
    ppr: 'incremental', // Should be detected for Next.js 16 migration
  },
  
  // Image optimization with deprecated domains
  images: {
    domains: ['example.com'], // Should be detected as deprecated
  },
};

module.exports = nextConfig;
