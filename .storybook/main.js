const path = require('path')

module.exports = {
  stories: ['../packages/blockchain-wallet-v4-frontend/src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  refs: {
    'constellation': {
      title: 'Constellation Components',
      url: 'https://blockchain.github.io/constellation/'
    },
    'blockchain-info-components': {
      title: 'Blockchain Info Components (Deprecated)',
      url: 'http://localhost:6007'
    }
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.alias = {
      '@core': path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4/src/'),
      components: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/components/'),
      data: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/data/'),
      hooks: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/hooks/'),
      layouts: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/layouts/'),
      middleware: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/middleware/'),
      providers: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/providers/'),
      services: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/services/'),
      utils: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/utils/'),
      generated: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/generated/')
    }

    // Return the altered config
    return config;
  },

}
