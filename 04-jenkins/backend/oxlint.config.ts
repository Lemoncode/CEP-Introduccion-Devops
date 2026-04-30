import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
    nursery: "warn",
    pedantic: "warn",
    perf: "warn",
    restriction: "warn",
    style: "warn",
    suspicious: "warn",
  },
  env: {
    node: true,
  },
  rules: {
    "arrow-body-style": "off",
    "eslint/capitalized-comments": [
      "off",
      {
        block: {
          ignorePattern: "^\\s*v8 ignore (start|stop)",
        },
      },
    ],
    "eslint/id-length": "off",
    "eslint/init-declarations": "off",
    "eslint/max-lines-per-function": "off",
    "eslint/max-statements": "off",
    "eslint/no-console": "off",
    "eslint/no-magic-numbers": "off",
    "eslint/no-ternary": "off",
    "oxc/no-async-await": "off",
    "oxc/no-optional-chaining": "off",
    "oxc/no-rest-spread-properties": "off",
    "sort-imports": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/no-null": "off",
  },
});
