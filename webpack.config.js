var webpack = require("webpack");
module.exports = {
  mode: "production",
  optimization: {
    nodeEnv: "production",
    minimize: true,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|hu/),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
};
