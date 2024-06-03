import eslint from "@eslint/js";

import tseslint from "typescript-eslint";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import "eslint-plugin-only-warn";

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
  packageJson,
  eslintPluginPrettierRecommended,
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
          project: [
            "../../apps/*/tsconfig.json",
            "../../packages/*/tsconfig.json",
          ],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ),
];

// module.exports = {
//   extends: [
//     require.resolve("@vercel/style-guide/eslint/node"),
//     require.resolve("@vercel/style-guide/eslint/typescript"),
//     require.resolve("@vercel/style-guide/eslint/comments"),
//     "plugin:prettier/recommended",
//   ],
//   ignorePatterns: ["node_modules/", "dist/", "**/*.css"],
//   parserOptions: {
//     project,
//   },
//   plugins: ["prettier", "only-warn", "perfectionist"],
//   rules: {
//     "perfectionist/sort-objects": [
//       "error",
//       {
//         order: "asc",
//         type: "natural",
//       },
//     ],
//     "prettier/prettier": "error",
//   },
//   settings: {
//     "import/resolver": {
//       typescript: {
//         project,
//       },
//     },
//   },
// };
