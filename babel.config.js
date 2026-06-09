module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['expo/node_modules/babel-preset-expo'],
    plugins: [
      './src/utils/babel-plugin-clean-import-meta.js'
    ]
  };
};
