module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
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
