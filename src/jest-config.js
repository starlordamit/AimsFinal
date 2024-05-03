module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    // Handle module aliases (if you use them in your project)
    "^@components/(.*)$": "<rootDir>/src/components/$1",
  },
  testEnvironment: "jsdom",
};
