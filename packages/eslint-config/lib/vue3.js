const { isTsProject } = require('./utils');

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: isTsProject ? '@typescript-eslint/parser' : '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    isTsProject && 'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:prettier/recommended',
  ].filter(Boolean),
  rules: {
    ...(isTsProject
      ? {
          '@typescript-eslint/no-explicit-any': 0,
          '@typescript-eslint/no-non-null-assertion': 0,
        }
      : {}),
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
      ],
    },
    {
      files: ['./__test__/*-test.ts', './__test__/*.spec.ts'],
      env: {
        node: true,
        jest: true,
      },
      extends: [
        'eslint:recommended',
        isTsProject && 'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'prettier',
        'plugin:prettier/recommended',
      ].filter(Boolean),
    },
  ],
};
