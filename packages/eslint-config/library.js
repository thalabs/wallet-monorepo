// const { resolve } = require('node:path');
// const perfectionist = require('eslint-plugin-perfectionist');
//
// const project = resolve(process.cwd(), 'tsconfig.json');
//
// console.log(project)
//
//
// /*
//  * This is a custom ESLint configuration for use with
//  * typescript packages.
//  *
//  * This config extends the Vercel Engineering Style Guide.
//  * For more information, see https://github.com/vercel/style-guide
//  *
//  */
//
// module.exports = {
//   extends: [
//     // perfectionist,
//     // 'eslint-config-turbo',
//     require.resolve('@vercel/style-guide/eslint/node'),
//     require.resolve('@vercel/style-guide/eslint/typescript'),
//     require.resolve('@vercel/style-guide/eslint/comments'),
//   ],
//   parserOptions: {
//     project,
//   },
//   // linterOptions: {
//   //   reportUnusedDisableDirectives: 'error',
//   // },
//   // TODO: why do we need to downgrade errors to warnings?
//   plugins: ['only-warn'],
//
//   // add rules configurations here
//   rules: {
//     'perfectionist/sort-objects': [
//       'error',
//       {
//         type: 'natural',
//         order: 'asc',
//       },
//     ],
//   },
//   settings: {
//     'import/resolver': {
//       typescript: {
//         project,
//       },
//     },
//   },
//   ignorePatterns: ['node_modules/', 'dist/', '**/*.css'],
// };

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
		require.resolve("@vercel/style-guide/eslint/comments")
	],
	parserOptions: {
		project
	},
	plugins: ["only-warn", "perfectionist"],
	rules: {
		"perfectionist/sort-objects": [
			"error",
			{
				type: "natural",
				order: "asc"
			}
		]
	},
	settings: {
		"import/resolver": {
			typescript: {
				project
			}
		}
	},
	ignorePatterns: ["node_modules/", "dist/", "**/*.css"]
};
