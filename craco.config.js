module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      const fileLoaderRule = webpackConfig.module.rules.find(rule => rule.test && rule.test.test('.svg'));
      if (fileLoaderRule) {
        fileLoaderRule.exclude = /\.svg$/;
      }

      webpackConfig.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      webpackConfig.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
}
