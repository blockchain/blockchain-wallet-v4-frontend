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
        ['babel-plugin-styled-components', { displayName: true }],
        ['react-refresh/babel', { skipEnvCheck: true }]
      ]
    },
    staging: {
      presets: [
        ['@babel/preset-env', { modules: false }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['module-resolver', { root: ['./src'] }],
        ['babel-plugin-styled-components', { displayName: true }],
        ['react-refresh/babel', { skipEnvCheck: true }]
      ]
    },
    test: {
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }
  }
}
