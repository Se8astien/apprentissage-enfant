import eslint from "@eslint/js";
import globals from "globals";

const strictRules = {
  ...eslint.configs.recommended.rules,
  "no-unused-vars": "off",
  "no-useless-assignment": "off",
  "no-empty": "off",
  "no-useless-escape": "off",
};

const esModules = {
  files: ["app-init.js", "app-*.js", "games-*.js", "games-registry.js"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: { ...globals.browser, ...globals.es2021 },
  },
  rules: {
    ...strictRules,
    "no-undef": "error",
    "no-redeclare": "error",
    "no-import-assign": "error",
    "no-setter-return": "error",
    "no-unreachable": "error",
    "no-constant-binary-expression": "error",
  },
};

const nodeTooling = {
  files: ["playwright.config.js", "tests/**/*.js", "scripts/**/*.mjs"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: { ...globals.node, ...globals.browser },
  },
  rules: {
    ...strictRules,
    "no-undef": "error",
    "no-redeclare": "error",
    "no-unreachable": "error",
  },
};

export default [
  { ignores: ["node_modules/**", "test-results/**", "app.js"] },
  esModules,
  nodeTooling,
];
