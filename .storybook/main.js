const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.js", "../src/components/**/*.stories.js"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-knobs/register",
  ],
};
