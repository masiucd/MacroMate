module.exports = {
  extends: ["plugin:react-hooks/recommended"],
  plugins: [
    "react-hooks",
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
}
