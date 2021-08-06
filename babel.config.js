module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react']
    }
  },
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-private-methods', { 'loose': true }],
    ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
  ]
}
