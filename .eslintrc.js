module.exports = {
    plugins: ['@stylistic','prettier'],
    'root': true,
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true,
        },
    },
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
    },
    'rules': {
        '@stylistic/array-bracket-newline': [
            'error',
            {
                'multiline': true,
            },
        ],
        '@stylistic/array-bracket-spacing': [
            'error',
            'never',
        ],
        '@stylistic/array-element-newline': [
            'error',
            'consistent',
        ],
        '@stylistic/arrow-parens': [
            'error',
            'always',
        ],
        '@stylistic/comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
                'imports': 'always-multiline',
                'objects': 'only-multiline',
            },
        ],
        '@stylistic/brace-style': 'error',
        '@stylistic/disallowMultipleVarDecl': 0,
        '@stylistic/indent': [
            'error',
            4,
            {
                'ignoredNodes': ['SwitchCase'],
            },
        ],
        '@stylistic/linebreak-style': [
            'error',
            'unix',
        ],
        '@stylistic/maximumLineLength': 0,
        '@stylistic/no-console': 0,
        '@stylistic/quotes': [
            'error',
            'single',
        ],
        '@stylistic/semi': [
            'error',
            'always',
        ],
        // ,
        // "vue/html-indent": [
        //     "warn",
        //     4
        // ]
    },
};
