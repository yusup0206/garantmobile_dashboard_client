import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // i18n guard (D-13): a raw Russian literal passed to t() is forbidden —
      // use a dotted key from src/i18n/dict.ts instead.
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='t'] > Literal[value=/[А-Яа-яЁё]/]",
          message:
            "Русский текст как ключ запрещён — используйте точечный ключ из dict.ts",
        },
      ],
    },
  },
);
