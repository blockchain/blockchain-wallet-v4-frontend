import manageTranslations from 'react-intl-translations-manager'
import bcManageTranslations from 'react-intl-translations-manager-bc'
import { languages } from 'services/LanguageService'
import { reject, prop } from 'ramda'

const isEnglish = code => code === 'en'
const codes = reject(isEnglish, languages.map(prop('language')))

// react-intl-translations-manager sets the defaultMessage as the value
// for translations that are not yet set. one hour needs only the en.json
// and the translation file with the same keys but the values empty or null

manageTranslations({
  messagesDirectory: './build/extractedMessages',
  translationsDirectory: './src/assets/locales',
  whitelistsDirectory: './src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: ['en']
})

bcManageTranslations({
  messagesDirectory: './build/extractedMessages',
  translationsDirectory: './src/assets/locales',
  whitelistsDirectory: './src/assets/locales/whitelists',
  singleMessagesFile: true,
  languages: codes
})
