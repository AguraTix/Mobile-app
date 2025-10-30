const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Merge aliases if already defined, or create a new one
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  "@": path.resolve(__dirname),
};

// Optional: Add file extensions if needed, to avoid resolution problems
config.resolver.sourceExts = [
  ...(config.resolver.sourceExts || []),
  "jsx",
  "js",
  "ts",
  "tsx",
  "json",
];

module.exports = config;
