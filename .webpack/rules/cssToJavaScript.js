const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

// Tailwind v4 uses CSS-first configuration via @tailwindcss/postcss
const tailwindcss = require('@tailwindcss/postcss');

const cssToJavaScript = {
  test: /\.css$/,
  use: [
    //'style-loader',
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1 } },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          verbose: true,
          plugins: [tailwindcss, autoprefixer],
        },
      },
    },
  ],
};

module.exports = cssToJavaScript;
