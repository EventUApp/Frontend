// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      // Shared values are intentionally mutable by Reanimated on the UI thread.
      "react-hooks/immutability": "off",
      // The hydration flag prevents a server/client color-scheme mismatch.
      "react-hooks/set-state-in-effect": "off",
    },
  }
]);
