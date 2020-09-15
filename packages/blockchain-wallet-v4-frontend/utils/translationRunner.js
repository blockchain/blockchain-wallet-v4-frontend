const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  messagesDirectory: 'build/extractedMessages',
  translationsDirectory: 'src/assets/locales',
  whitelistsDirectory: 'src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: ['en']
})
