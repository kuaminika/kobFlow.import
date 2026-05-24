module.exports = {
  apps: [
    {
      name: "kobFlow.import",
      script: "src/index.js", // update this to your actual entry point
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};