import nx from '@nx/eslint-plugin';
import angularEslintTemplate from '@angular-eslint/eslint-plugin-template';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import angularEslint from '@angular-eslint/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';
import html from '@html-eslint/eslint-plugin';
import jsonc from 'jsonc-eslint-parser';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    ignores: ['dist', '**/**/eslint.config.mjs'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$', '^mocks/.*'],
          depConstraints: [
          ],
        },
      ],
      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/relative-url-prefix': 'error',
      '@angular-eslint/use-component-selector': 'warn',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/no-output-native': 'warn',
      '@angular-eslint/component-class-suffix': 'warn',
      '@angular-eslint/no-output-on-prefix': 'warn',
      '@angular-eslint/no-input-rename': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'arrow-parens': ['warn', 'always'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': [
        'error',
        {
          objects: 'always-multiline',
          arrays: 'always-multiline',
          functions: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
        },
      ],
      'no-case-declarations': 'warn',
      'prefer-const': 'warn',
      'no-control-regex': 'warn',
      'no-prototype-builtins': 'warn',
      'no-restricted-syntax': 'warn',
      'no-empty': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-dupe-else-if': 'warn',
      'constructor-super': 'error',
      'eol-last': 'warn',
      'id-blacklist': 'warn',
      'import/order': 'warn',
      'linebreak-style': 'warn',
      'max-len': [
        'error',
        {
          ignorePattern: '^import \\{[^}]+\\} from ',
          code: 156,
        },
      ],
      'new-parens': 'warn',
      'newline-per-chained-call': 'warn',
      'no-extra-semi': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-shadow': 'warn',
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': 'warn',
      'space-before-function-paren': ['off', 'never'],
      'space-in-parens': ['warn', 'never'],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@|angular', '^@?\\w'], // External scoped and non-scoped packages,
            ['@geodome\\w'], // Geodome packages
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent directory imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Local directory imports
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-console': [
        'warn',
        {
          allow: ['error', 'warn', 'debug'],
        },
      ],
      'no-debugger': 'error',
      'no-var': 'error',
      'array-callback-return': [
        'error',
        {
          checkForEach: true,
        },
      ],
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      semi: ['warn', 'always'],
    },
    plugins: {
      import: eslintPluginImport,
      'simple-import-sort': simpleImportSort,
      'angular-eslint': angularEslint,
      'unused-imports': unusedImports,
      '@angular-eslint/template': angularEslintTemplate,
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'off',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: jsonc,
    },
  },
  {
    ...html.configs['flat/recommended'],
    files: ['**/*.html'],
    languageOptions: {
      parser: '@angular-eslint/template-parser',
    },
    rules: {
      ...html.configs['flat/recommended'].rules,

      '@html-eslint/indent': 'off',
      '@html-eslint/no-duplicate-attrs': 'error',
      '@html-eslint/no-obsolete-tags': 'error',
      '@html-eslint/no-inline-styles': 'warn',
      '@html-eslint/element-newline': 'off',
      '@html-eslint/no-trailing-spaces': 'off',
      '@html-eslint/no-extra-spacing-attrs': 'warn',
      '@html-eslint/require-attrs': [
        'warn',
        {
          tag: 'input',
          attr: 'data-testid',
        },
        {
          tag: 'button',
          attr: 'data-testid',
        },
        {
          tag: 'textarea',
          attr: 'data-testid',
        },
        {
          tag: 'select',
          attr: 'data-testid',
        },
        {
          tag: 'a',
          attr: 'data-testid',
        },
        {
          tag: 'form',
          attr: 'data-testid',
        },
        {
          tag: 'label',
          attr: 'data-testid',
        },
        {
          tag: 'fieldset',
          attr: 'data-testid',
        },
        {
          tag: 'legend',
          attr: 'data-testid',
        },
        {
          tag: 'details',
          attr: 'data-testid',
        },
        {
          tag: 'summary',
          attr: 'data-testid',
        },
        {
          tag: 'dialog',
          attr: 'data-testid',
        },
        {
          tag: 'meter',
          attr: 'data-testid',
        },
        {
          tag: 'progress',
          attr: 'data-testid',
        },
        {
          tag: 'output',
          attr: 'data-testid',
        },
        {
          tag: 'datalist',
          attr: 'data-testid',
        },
        {
          tag: 'menu',
          attr: 'data-testid',
        },
      ],
      '@angular-eslint/template/prefer-control-flow': ['error'],
      '@angular-eslint/template/no-duplicate-attributes': ['error'],
      '@angular-eslint/template/banana-in-box': ['error'],
      '@angular-eslint/template/conditional-complexity': ['warn'],
      '@angular-eslint/template/eqeqeq': ['warn'],
      '@angular-eslint/template/no-any': ['error'],
      '@angular-eslint/template/no-negated-async': ['error'],
      '@angular-eslint/template/prefer-self-closing-tags': ['off'],
      '@angular-eslint/template/label-has-associated-control': 'warn',
      '@angular-eslint/template/click-events-have-key-events':  'off',
      '@angular-eslint/template/no-positive-tabindex': 'warn',
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'TWO_WAY_BINDING',
            'TEMPLATE_REFERENCE',
            'STRUCTURAL_DIRECTIVE',
            'ATTRIBUTE_BINDING',
            'INPUT_BINDING',
            'OUTPUT_BINDING',
          ],
        },
      ],
    },
  },
];
