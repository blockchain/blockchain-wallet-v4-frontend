module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }
  },
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-object-rest-spread',
    ['inline-react-svg', { ignorePattern: '(?<!component.)svg' }],
    ['@babel/plugin-proposal-private-methods', { 'loose': true }],
    ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
  ]
}
