import eslint from "@eslint/js";

import tseslint from "typescript-eslint";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";

import "eslint-plugin-only-warn";

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
  packageJson,
  eslintPluginPrettierRecommended,
  comments.recommended,
  {
    ignores: ["package.json"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "prettier/prettier": "error",
    },
  },
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
      ignores: ["*.json", "*.js"],
      languageOptions: {
        parserOptions: {
          project: true,
        },
      },
    },
  ),
];
