module.exports = {
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|svg|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        exclude: /\.inline.svg$/,
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.inline.svg$/,
        use: '@svgr/webpack'
      }
    ]
  }
}
