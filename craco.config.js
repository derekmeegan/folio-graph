module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  //   webpack: {
  //     target: "node",
  //     configure: {
  //       resolve: {
  //         fallback: {
  //           //   stream: require.resolve("stream-browserify"),
  //           //   querystring: require.resolve("querystring-es3"),
  //           //   os: require.resolve("os-browserify/browser"),
  //           //   fs: false,
  //         },
  //       },
  //     },
  //   },
};
