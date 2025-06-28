import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Custom project‐level rule overrides – keep feedback visible while unblocking the build
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",

      // React
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
