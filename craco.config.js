const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@types": path.resolve(__dirname, "src/types"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
};