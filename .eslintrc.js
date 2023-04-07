module.exports = {
  extends: [
    '@mate-academy/eslint-config-react-typescript',
    'plugin:react/recommended',
  ],
  rules: {
    // React
    'react/prop-types': 0,
    'react/self-closing-comp': 0,
    'react/display-name': 0,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],

    // JavaScript
    semi: 0,
    'no-proto': 0,
    'no-unused-vars': 0,

    // TypeScript
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/semi': ['error'],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
  },
}

