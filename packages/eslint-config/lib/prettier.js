module.exports = {
  printWidth: 80,
  useTabs: false,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};