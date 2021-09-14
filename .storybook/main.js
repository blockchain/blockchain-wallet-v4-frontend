const path = require('path')

module.exports = {
  stories: ['../packages/blockchain-wallet-v4-frontend/src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode'
  ],
  refs: {
    'new-core': {
      title: 'New Core Components',
      url: 'https://blockchain.github.io/constellation/'
    },
    'design-system': {
      title: 'Core Components',
      url: 'http://localhost:6007'
    }
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.alias = {
      components: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/components/'),
      middleware: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/middleware/'),
      data: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/data/'),
      layouts: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/layouts/'),
      providers: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/providers/'),
      services: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/services/'),
      utils: path.resolve(__dirname, '..', 'packages/blockchain-wallet-v4-frontend/src/utils/')
    }

    // Return the altered config
    return config;
  },

}
  