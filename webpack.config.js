const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const htmlWebpackTemplates = ['index'];

let htmlWebpackPlugins = htmlWebpackTemplates.map(name => {
    return new HtmlWebpackPlugin({
        minify: {
            collapseWhitespace: false
        },
        filename: `${name}.html`,
        template: `${name}.html`
    })
});


const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };
    if (isProduction) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
};

const filename = ext => isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDevelopment,
                reloadAll: true,
            },
        },
        'css-loader'
    ];
    if (extra) {
        loaders.push(extra)
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './assets/js/index.js',
    },
    // output: {
    //     filename: filename('js'),
    //     path: path.resolve(__dirname, 'dist')
    // },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 9000,
        // hot: isDevelopment
    },
    devtool: isDevelopment ? 'source-map' : '',
    plugins: [
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                // {
                //     from: path.resolve(__dirname, 'src/assets/favicon.ico'),
                //     to: path.resolve(__dirname, 'dist/assets/favicon.ico')
                // },
                {
                    from: path.resolve(__dirname, 'src/assets/img'),
                    to: path.resolve(__dirname, 'dist/assets/img')
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].[hash].css",
        })
    ].concat(htmlWebpackPlugins),
    module: {
        rules: [

            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            context: '',
                            outputPath: 'assets/img/',
                            publicPath: '../assets/img/',
                            esModule: false
                        },
                    },

                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts',
                            publicPath: '../fonts/',
                        },
                    },

                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};