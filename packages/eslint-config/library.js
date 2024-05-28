const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/comments"),
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["node_modules/", "dist/", "**/*.css"],
  parserOptions: {
    project,
  },
  plugins: ["prettier", "only-warn", "perfectionist"],
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
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
};
