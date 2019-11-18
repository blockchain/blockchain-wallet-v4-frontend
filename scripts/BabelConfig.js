const path = require(`path`)

module.exports = directory => {
  const resolve = subdirectory => path.resolve(directory, subdirectory)

  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      'babel-plugin-styled-components',
      [
        'module-resolver',
        {
          root: [resolve('src')],
          alias: { data: resolve('src/data') }
        }
      ],
      ['react-intl', { messagesDir: resolve('build/extractedMessages') }]
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
          [
            'module-resolver',
            {
              root: [resolve('src')],
              alias: { data: resolve('src/data') }
            }
          ],
          ['react-intl', { messagesDir: resolve('build/extractedMessages') }]
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
          [
            'module-resolver',
            {
              root: [resolve('src')],
              alias: { data: resolve('src/data') }
            }
          ],
          'react-hot-loader/babel'
        ]
      }
    }
  }
}
