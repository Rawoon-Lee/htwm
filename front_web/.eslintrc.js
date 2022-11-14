module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react', 'prettier'],
  extends: ['plugin:prettier/recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
  settings: {
    react: {
      version: 'detect',
    },
  },
}
