module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["jest-extended"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  coverageDirectory: "<rootDir>/tests-coverage/unit",
  collectCoverageFrom: [
    "src/**/*.{js,vue,ts}",
    "!**/node_modules/**",
    "!src/main.ts",
    "!src/App.vue",
    "!src/views/**",
    "!src/store/**/*.{js,ts}",
    "!src/router/**/*.{js,ts}",
  ],
  moduleFileExtensions: ["js", "ts", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
  },
};
