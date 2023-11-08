/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    // "standard",
    // "standard-jsx",
    // "standard-react",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    // "plugin:eslint-comments/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "import",
    // "unused-imports",
    "react-hooks",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    // "import/resolver": {
    //   typescript: {
    //     alwaysTryTypes: true,
    //     project: ["./tsconfig.json"],
    //   },
    // },
  },
  rules: {
    "import/no-unresolved": "off",
    // "eslint-comments/no-unused-disable": "error",
    "react/prop-types": "off",
    "react/no-unused-prop-types": "off",
    "import/named": "off",
    "import/namespace": "off",
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    indent: "off",
    "@typescript-eslint/indent": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-undef": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/jsx-fragments": "off",
    "react/display-name": "off",
    "sort-imports": "off",
    "import/order": ["warn", { alphabetize: { order: "asc" } }],
    // "unused-imports/no-unused-imports": "error",
  },
  // new configs to adapt current changes
  ignorePatterns: ["src/panels/AnnotationManagement/ImageView"],
  root: true,
};
