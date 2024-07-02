module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    "object-curly-spacing": "off",
    "max-len": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "quote-props": "off",
    "@typescript-eslint/no-var-requires": "off",
    "new-cap": "off",
    "spaced-comment": "off",
    indent: "off",
    camelcase: "off",
    "operator-linebreak": "off",
    "require-jsdoc": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "padded-blocks": "off",
    "linebreak-style": "off",
  },
};
