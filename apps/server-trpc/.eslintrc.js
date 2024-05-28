module.exports = {
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
	],
	root: true,
	rules: {
		"@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "all" }],
		"logical-assignment-operators": [
			"error",
			"always",
			{ enforceForIfStatements: true }
		],
		"no-constant-condition": "off",
		"no-useless-rename": "error",
		"object-shorthand": "error",
		"operator-assignment": "error",
		"perfectionist/sort-objects": [
			"error",
			{
				order: "asc",
				"partition-by-comment": true,
				type: "natural"
			}
		]
	}
};


