module.exports = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/tests/**/*.ts"],
  testEnvironment: "node",
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
