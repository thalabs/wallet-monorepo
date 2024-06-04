import jsoncParser from "jsonc-eslint-parser";

export default [
  {
    files: ["*.json", "*.json5"],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      "jsonc/comma-dangle": "off",
      "jsonc/no-comments": "off",
      "jsonc/sort-keys": "error",
    },
  },
];
