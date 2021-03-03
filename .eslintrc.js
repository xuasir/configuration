module.exports = {
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 'off',
    curly: 'warn',
  },
};
