import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import library from "./eslint.config.js";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
export default [
  ...library,
  reactRecommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "unicorn/filename-case": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
