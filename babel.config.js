module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
    ],

    plugins,
  };
};
