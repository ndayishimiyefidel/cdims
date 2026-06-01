module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier', // must be last to override ESLint formatting rules
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script', // CommonJS modules
  },
  rules: {
    // Possible Problems
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console.log for server-side logging
    'no-process-exit': 'warn',

    // Suggestions
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'curly': ['error', 'all'],
    'dot-notation': 'off', // Off to avoid noise from Sequelize operators (Op.or, Op.like, etc.)

    // Node.js specifics
    'no-path-concat': 'error',
    'no-buffer-constructor': 'error',

    // Best practices
    'array-callback-return': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'warn',

    // Style (handled by Prettier, but keeping a few)
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', 'migrations/', 'seeders/', '*.json', 'config/config.json'],
};
