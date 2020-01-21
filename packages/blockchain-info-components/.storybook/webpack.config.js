module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|svg|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
