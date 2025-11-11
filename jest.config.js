const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testMatch: ["<rootDir>/tests/**/*.ts"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
