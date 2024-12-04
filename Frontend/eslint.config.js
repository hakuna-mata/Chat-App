import globals from "globals"; // Provides global variables like `window` and `document`
import pluginJs from "@eslint/js"; // Core JavaScript rules
import pluginReact from "eslint-plugin-react"; // React-specific linting rules

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // General settings for all JavaScript files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Apply to JavaScript and JSX files
    languageOptions: {
      globals: globals.browser, // Enable browser globals
      ecmaVersion: "latest", // Use the latest ECMAScript version
      sourceType: "module", // Enable ES modules
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX syntax
        },
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Use recommended JavaScript rules
    },
  },
  // React-specific settings
  {
    files: ["**/*.{jsx,tsx}"], // Apply only to JSX and TSX files
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules, // Use recommended React rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/jsx-no-undef": "error", // Ensure JSX elements are defined
      "no-unused-vars": "warn"
    },
  },
];
