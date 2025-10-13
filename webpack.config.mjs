// webpack.config.js (ESM)
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_env = {}, argv = {}) => {
    const isProd = argv.mode === 'production';

    return {
        mode: isProd ? 'production' : 'development',
        bail: true,
        entry: {
            app: [
                './src/libs/jquery.slim.min.js',
                './src/libs/perlin.js',
                './src/libs/seedrandom.min.js',
                './src/entry',
            ],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public', 'js'),
            clean: true,
        },
        devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.s?css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '../css/futura.css',
            }),
        ],
        resolve: {extensions: ['.ts', '.tsx', '.js', '.scss']},
        stats: 'minimal',
    };
};