const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testMatch: ["<rootDir>/tests/**/*.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/.*/routers.ts",
    "/src/.*/entities/.*.entity.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
