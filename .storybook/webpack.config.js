const path = require("path");
const rootPath = path.resolve(__dirname, "../src");

//github.com/storybookjs/storybook/issues/6743
https: module.exports = ({ config }) => {
  config.resolve.alias["@"] = rootPath;
  config.resolve.alias["~"] = rootPath;

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      "vue-style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          prependData: `
						@import "@/assets/index.scss";
						@import "@/assets/media-query.scss";
					`
        }
      }
    ]
  });

  // config.resolve.extensions.push(".ts", ".vue", ".css", ".scss", ".html");

  return config;
};
