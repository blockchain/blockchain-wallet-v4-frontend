import manageTranslations from 'react-intl-translations-manager'
import bcManageTranslations from 'bc-react-intl-translations-manager'

// TODO: fork and publish version of react-intl-translations-manager

// react-intl-translations-manager sets the defaultMessage as the value
// for translations that are not yet set. one hour needs only the en.json
// and the translation file with the same keys but the values empty or null

manageTranslations({
  messagesDirectory: './build/extractedMessages',
  translationsDirectory: './src/assets/locales',
  whitelistsDirectory: './src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: [
    'en'
  ]
})

bcManageTranslations({
  messagesDirectory: './build/extractedMessages',
  translationsDirectory: './src/assets/locales',
  whitelistsDirectory: './src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: [
    'bg',
    'da',
    'de',
    'el',
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
