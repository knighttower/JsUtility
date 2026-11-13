const path = require('path');
const workingDir = process.cwd();
const TerserPlugin = require('terser-webpack-plugin');
const { targets, webpackFormats, polyfills } = require(`${workingDir}/source-files.cjs`);
const { getFlagValue } = require('./NodeHelpers.cjs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = getFlagValue('mode') ?? 'production';
const isProduction = mode === 'production';

const formats = webpackFormats ?? [
    { type: 'umd', dir: 'umd', ext: 'js' },
    { type: 'commonjs2', dir: 'cjs', ext: 'cjs' },
    { type: 'window', dir: 'browser', ext: 'js' },
];
// A package can set `polyfills: false` in its source-files.cjs to build without core-js
const polyfillOptions = polyfills === false ? { useBuiltIns: false, corejs: undefined } : {};
const cssRulesUse = (isBundle) => {
    const use = [
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                url: false, // Do not handle URLs in your CSS
            },
        },
    ];
    if (!isBundle) {
        use.unshift(MiniCssExtractPlugin.loader);
    } else {
        use.unshift('style-loader');
    }

    return use;
};

const postCss = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [require('autoprefixer'), isProduction ? require('cssnano') : false].filter(
                Boolean
            ),
        },
    },
};

/**
 * Generates a Webpack configuration for a given library name and target.
 *
 * @param {string} entry - The file source.
 * @param {string} target - The target name.
 * @param {string} dir - The directory name.
 * @param {string} libraryTarget - The library target format.
 * @param {string} ext - The file extension.
 * @returns {Object} - The Webpack configuration.
 */
const getWebpackConfig = (config) => ({
    mode: mode,
    entry: config.entry,
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, `${workingDir}/src`),
            path.resolve(__dirname, `${workingDir}/node_modules`),
        ],
        extensions: ['.mjs', '.js', '.json', '.cjs'],
    },
    plugins: (() => {
        if (config.bundle) {
            return [];
        }
        return [
            new MiniCssExtractPlugin({
                filename: config.exportName + '.css' || '[name].css',
            }),
        ];
    })(),
    output: {
        path: path.resolve(__dirname, `${workingDir}/dist/${config.dir}`),
        filename: `${config.exportName}.${config.ext}`,
        // library: config.exportName,
        // libraryTarget: config.libraryTarget,
        umdNamedDefine: true,
        // libraryExport: config.windowExport,
        globalObject: 'this',
        library: {
            name: config.exportName,
            type: config.libraryTarget,
            export: config.windowExport,
            umdNamedDefine: true,
        },
    },
    optimization: {
        minimize: isProduction ? true : false,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                // exclude: [/cb\.js$/, /extra\.js$/],
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    ecma: 6,
                    // keep_classnames: true, // Preserve class names
                    // keep_fnames: true, // Preserve function names
                    // safari10: true, // Workaround for Safari 10/11 loop scoping and await bugs

                    toplevel: true,
                    output: {
                        ascii_only: true, // Escape Unicode characters
                        braces: true, // Always insert braces in if, for, do, while or with statements
                        semicolons: true, // Separate statements with semicolons
                        comments: false,
                    },

                    compress: {
                        arrows: true, // Enable arrow function compression (transform to function expressions)
                    },
                    parse: {
                        html5_comments: false, // Ignore HTML5 comments
                        shebang: true, // Preserve shebang
                    },

                    mangle: true,
                },

                extractComments: false, // Do not extract comments to separate file
            }),
        ],
    },
    stats: isProduction ? 'normal' : 'minimal',

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: '> 0.5%, not dead, not ie 11', // Exclude IE11 & dead browsers
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                    modules: false,
                                    ...polyfillOptions,
                                },
                            ],
                        ],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [...cssRulesUse(config.bundle), postCss],
            },
            {
                test: /\.scss$/,
                use: [
                    ...cssRulesUse(config.bundle),
                    postCss, // Make sure postcss.config.js is configured with your desired plugins
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true,
                                implementation: require('sass'), // Ensure Dart Sass is used
                            },
                        },
                    },
                ],
            },
        ],
    },
});

/**
 * Extracts the file name without extension from a path if it ends with '.js'.
 * @param {string} path - The file path.
 * @returns {string|null} The file name without extension or null if not a '.js' file.
 */
function extractFileName(path) {
    const match = /([^\/]+)\.(js|css|sass|cjs|mjs|scss)$/.exec(path);
    return match ? match[1] : path;
}

// Generate multiple configurations
function getAllConfigs() {
    const configs = [];
    targets.forEach((target) => {
        const isArray = Array.isArray(target.file);
        const fileName = isArray ? 'bundle' : extractFileName(target.file);
        // Generate multiple configurations
        for (const format of formats) {
            const exportName = target.exportName ?? fileName;
            const entry = (() => {
                if (isArray) {
                    return {
                        [exportName]: target.file.map((file) => `${workingDir}/src/${file}`),
                    };
                }
                return `${workingDir}/src/${target.file}`;
            })();

            configs.push(
                getWebpackConfig({
                    entry,
                    fileName,
                    libraryTarget: format.type,
                    dir: format.dir,
                    ext: format.ext,
                    exportName: exportName,
                    windowExport: target.windowExport ?? undefined,
                    bundle: target.bundle ?? false,
                })
            );
        }
    });
    return configs;
}

const configs = getAllConfigs();

module.exports = configs;
