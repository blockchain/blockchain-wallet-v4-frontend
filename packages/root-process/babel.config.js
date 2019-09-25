module.exports = {
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-styled-components'
  ]
}
