import path from 'path';
import { fileURLToPath } from 'url';
import webpackNodeExternals from 'webpack-node-externals';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.tsx',
  target: 'node',
  externals: [webpackNodeExternals({
    allowlist: (moduleName) => {
      // NOTE: keytar ライブラリの中身はバイナリファイルでトランスパイル時にエラーが発生するため除外
      if (moduleName === 'keytar') return false;

      // NOTE: Expressはテンプレートエンジン機能があり、動的に読み込むファイルが変更されるため静的なトランスパイルができず、警告が出る。
      // express は webpack でビルドを行わないようにすることで警告を表示しないようにしている
      // 詳細については以下を参照:
      // https://github.com/webpack/webpack/issues/1576
      if (moduleName === 'express') return false;

      return true;
    }
  })],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
