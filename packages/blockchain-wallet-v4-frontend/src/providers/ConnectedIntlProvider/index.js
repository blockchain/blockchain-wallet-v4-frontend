import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { find, propEq } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { languages } from 'services/LanguageService'

const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage, (state, { messages }) => messages],
  (language, messages) => {
    const hasLang = propEq('language', language)
    const locale = find(hasLang, languages) ? language : 'en'
    return { locale, key: locale, messages: messages[locale] }
  }
)

export default connect(getData)(IntlProvider)
