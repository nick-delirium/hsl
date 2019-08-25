module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ['transform-remove-console'],
      ['module-resolver', {
        cwd: "packagejson",
        src: ['./node_modules'],
        alias: {
          '@': './',
        },
      }],
    ],
  };
};
