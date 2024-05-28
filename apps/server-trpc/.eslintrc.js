// const jsonc = require('eslint-plugin-jsonc');
// const markdown = require('eslint-config-plugin-markdown');
// const yml = require('eslint-config-plugin-yml');
//
// module.exports = {
//   root: true,
//   extends: [
//     '../../packages/eslint-config/library.js',
//     ...jsonc.configs['flat/recommended-with-json'],
//     ...markdown.configs.recommended,
//     ...yml.configs['flat/recommended'],
//     ...yml.configs['flat/prettier'],
//   ],
//   overrides: [
//     {
//       files: ['*.jsonc'],
//       rules: {
//         'jsonc/comma-dangle': 'off',
//         'jsonc/no-comments': 'off',
//         'jsonc/sort-keys': 'error',
//       },
//     },
//     {
//       files: ['**/*.{yml,yaml}'],
//       rules: {
//         'yml/file-extension': ['error', { extension: 'yml' }],
//         'yml/sort-keys': [
//           'error',
//           {
//             order: { type: 'asc' },
//             pathPattern: '^.*$',
//           },
//         ],
//         'yml/sort-sequence-values': [
//           'error',
//           {
//             order: { type: 'asc' },
//             pathPattern: '^.*$',
//           },
//         ],
//       },
//
//     },
//   ],
//
// };
//


module.exports = {
	root: true,
	extends: [
		"@repo/eslint-config/library",
		"@repo/eslint-config/jsonc",
		"@repo/eslint-config/yaml"
	],
	ignorePatterns: [
		"coverage*",
		"lib",
		"node_modules",
		"pnpm-lock.yaml",
		"**/*.snap"
	],
	rules: {
		"logical-assignment-operators": [
			"error",
			"always",
			{ enforceForIfStatements: true }
		],
		"operator-assignment": "error",
		"no-constant-condition": "off",
		"@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "all" }],
		"perfectionist/sort-objects": [
			"error",
			{
				order: "asc",
				"partition-by-comment": true,
				type: "natural"
			}
		],
		"no-useless-rename": "error",
		"object-shorthand": "error"
	},
	overrides: [
		{
			files: ["**/*.md/*.ts"],
			rules: {
				"n/no-missing-import": ["error", { allowModules: ["server-trpc"] }]
			}
		},
		{
			files: ["**/*.test.*"],
			// env: {
			// 	vitest: true
			// },
			rules: {
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off"
			}
		}
	]
};


