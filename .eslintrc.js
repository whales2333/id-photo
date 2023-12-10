module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    // 'react/destructuring-assignment': [0, 'always'],
    'react/react-in-jsx-scope': 'off',
    // 'react/prop-types': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': ['error', { props: false }],
    // 'no-shadow': 'off',
    // camelcase: 'off',
    // 'prefer-destructuring': 'warn',
    'no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        // '@typescript-eslint/explicit-module-boundary-types': 'off',
        // '@typescript-eslint/no-explicit-any': 'off',
        // '@typescript-eslint/no-var-requires': 'off',
        // '@typescript-eslint/no-non-null-assertion': 'off',
        // '@typescript-eslint/no-this-alias': 'off',
        // '@typescript-eslint/ban-ts-comment': 'off',

        // note you must disable the base rule as it can report incorrect errors
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
      },
    },
  ],
};
