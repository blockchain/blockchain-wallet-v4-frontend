import manageTranslations from 'react-intl-translations-manager'

manageTranslations({
  messagesDirectory: './build/extractedMessages',
  translationsDirectory: './src/assets/locales',
  whitelistsDirectory: './src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: [
    'bg',
    'da',
    'de',
    'el',
    'en',
    'es',
    'fr',
    'hi',
    'hu',
    'id',
    'it',
    'ja',
    'ko',
    'nl',
    'nn',
    'no',
    'pl',
    'pt',
    'ro',
    'ru',
    'sl',
    'sv',
    'th',
    'tr',
    'vi',
    'zh'
  ]
})
