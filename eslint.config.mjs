import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],  // Apply to these file types
    languageOptions: {
      globals: globals.browser,
      parser: tsParser, 
    },
    rules: {
      "semi": ["error", "always"], // Enforce semicolons at the end of statements
      "quotes": ["error", "single"], // Enforce single quotes for strings
      "indent": ["error", 4], // Enforce 2-space indentation
      "no-trailing-spaces": "error", // Disallow trailing whitespace
      "eol-last": ["error", "always"], // Ensure newline at the end of files
      "@typescript-eslint/no-unused-vars": ["warn"],// Warn on unused variables in TypeScript
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
