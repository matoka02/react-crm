const LocalizationGenerator = require('./scripts/localizationGenerator');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',      // off for API-routes in pages/api/*
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    const localizationGenerator = new LocalizationGenerator();
    localizationGenerator.generateLocalizationFile();

    return config;
  },
};

module.exports = nextConfig;
