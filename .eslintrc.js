module.exports = {
  extends: ["airbnb-base", "plugin:react/recommended"],
  parser: "babel-eslint",
  plugins: ["react"],
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {
    es6: true,
    browser: true,
    node: true
  }
};
