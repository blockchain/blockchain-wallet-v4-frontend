module.exports = {
  stories: ['../stories/**/*.stories.@(js|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    'themeprovider-storybook/register',
    '@react-theming/storybook-addon',
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
  }
}
