module.exports = {
  stories: ['../packages/blockchain-wallet-v4-frontend/src/components/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode'
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    }
  },
  refs: {
    'new-core': {
      title: 'New Core Components',
      url: 'https://blockchain.github.io/constellation/'
    },
    'design-system': {
      title: 'Core Components',
      url: 'http://localhost:6007'
    }
  }
}
  