module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    ['module-resolver', { root: ['./src'] }]
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
        ['module-resolver', { root: ['./src'] }]
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
        ['module-resolver', { root: ['./src'] }],
        'react-hot-loader/babel',
        ['babel-plugin-styled-components', { displayName: true }]
      ]
    },
    staging: {
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['module-resolver', { root: ['./src'] }],
        'react-hot-loader/babel',
        ['babel-plugin-styled-components', { displayName: true }]
      ]
    },
    test: {
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }
  }
}
