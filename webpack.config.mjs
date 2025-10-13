import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: {
        app: [
            './src/libs/jquery.slim.min.js',
            './src/libs/perlin.js',
            './src/libs/seedrandom.min.js',
            './src/entry.js',
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public', 'js'),
        clean: true,
    },
    devtool: 'source-map',
    module: {rules: []},
    resolve: {extensions: ['.js']},
};