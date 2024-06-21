import library from "@repo/eslint-config/library";

export default [
  ...library,
  {
    ignores: ["src/clarigen-types.ts"],
  },
];
