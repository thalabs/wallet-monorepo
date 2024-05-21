/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: "./",
});

const baseConfig: Config = {

    updateSnapshot: true,

    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    // The test environment that will be used for testing
    testEnvironment: "jsdom",

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ],

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",
};

const config = createJestConfig(baseConfig);

export default config;
