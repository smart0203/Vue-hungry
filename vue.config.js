const { version } = require("./package.json");
const CompressionPlugin = require("compression-webpack-plugin");
const RollbarSourceMapPlugin = require("rollbar-sourcemap-webpack-plugin");
const zlib = require("zlib");

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const CircularDependencyPlugin = require('circular-dependency-plugin')
const publicPath = process.env.VUE_APP_PUBLIC_PATH || "./";

module.exports = {
  publicPath,
  // to register global sass variable

  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0",
    proxy: process.env.VUE_APP_API_DOMAIN,
    overlay: {
      // warnings: true,
      errors: true,
    },
    // public: "https://localhost:8080/",
    // https: {
    //   key: fs.readFileSync("./local_ssl/lvh.me+4-key.pem"),
    //   cert: fs.readFileSync("./local_ssl/lvh.me+4.pem"),
    // },
  },
  configureWebpack: (config) => {
    //config.devtool = "hidden-source-map";
    config.output.filename = "index-[hash].min.js";
    config.module.rules = [
      {
        test: /\.worker\.js$/i,
        use: [
          {
            loader: "comlink-loader",
            options: {
              singleton: true,
            },
          },
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      ...config.module.rules,
    ];
  },

  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
    config.plugins.delete("fork-ts-checker");

    config.plugin("html").tap((args) => {
      args[0].omisePublicKey = process.env.VUE_APP_OMISE_PUBLIC_KEY;
      args[0].facebookAppId = process.env.VUE_APP_FACEBOOK_APP_ID;
      args[0].gtmId = process.env.VUE_APP_GOOGLE_TAG_ID;
      return args;
    });

    config.resolve.alias.set(
      "@vue/composition-api/dist/vue-composition-api.esm.js",
      "@vue/composition-api/dist/vue-composition-api.mjs"
    );
    config.resolve.alias.set(
      "@vue/composition-api",
      "@vue/composition-api/dist/vue-composition-api.mjs"
    );

    config.plugin("CompressionPlugin").use(
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
    config.plugin("CompressionPlugin").use(
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 10240,
        minRatio: 0.8,
      })
    );

    // config.plugin("CircularDependencyPlugin").use(
    //   new CircularDependencyPlugin({
    //     // exclude detection of files based on a RegExp
    //     exclude: /a\.js|node_modules/,
    //     // include specific files based on a RegExp
    //     // add errors to webpack instead of warnings
    //     failOnError: true,
    //     // allow import cycles that include an asyncronous import,
    //     // e.g. via import(/* webpackMode: "weak" */ './file.js')
    //     allowAsyncCycles: false,
    //     // set the current working directory for displaying module paths
    //     cwd: process.cwd(),
    //   })
    // )

    // config.plugin('BundleAnalyzerPlugin').use(new BundleAnalyzerPlugin())
    if (
      process.env.NODE_ENV === "production" &&
      process.env.VUE_APP_ROLLBAR_IS_ENABLED == true
    ) {
      config.plugin("RollbarSourceMap").use(
        new RollbarSourceMapPlugin({
          accessToken: process.env.VUE_APP_ROLLBAR_SOURCE_MAPS_TOKEN,
          publicPath,
          version,
        })
      );
    }

    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
};
