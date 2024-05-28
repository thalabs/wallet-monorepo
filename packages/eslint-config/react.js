const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    './library.js',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/react',
  ].map(require.resolve),
  globals: {
    React: true,
    JSX: true,
  },

  // add rules configurations here
  rules: {},
};