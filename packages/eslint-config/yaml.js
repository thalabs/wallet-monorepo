import eslintPluginYml from "eslint-plugin-yml";
export default [
  ...eslintPluginYml.configs["flat/standard"],
  {
    rules: {
      "yml/file-extension": ["error", { extension: "yml" }],
      "yml/sort-keys": [
        "error",
        {
          order: { type: "asc" },
          pathPattern: "^.*$",
        },
      ],
      "yml/sort-sequence-values": [
        "error",
        {
          order: { type: "asc" },
          pathPattern: "^.*$",
        },
      ],
    },
  },
];
