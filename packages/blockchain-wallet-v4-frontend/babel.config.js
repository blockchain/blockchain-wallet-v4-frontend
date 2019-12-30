module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-styled-components',
    ['module-resolver', { root: ['./src'] }],
    ['react-intl', { messagesDir: './build/extractedMessages' }]
  ],
  ignore: [],
  env: {
    production: {
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-styled-components',
        ['module-resolver', { root: ['./src'] }],
        ['react-intl', { messagesDir: './build/extractedMessages' }]
      ]
    },
    development: {
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-styled-components',
        ['module-resolver', { root: ['./src'] }],
        'react-hot-loader/babel'
      ]
    }
  }
}
