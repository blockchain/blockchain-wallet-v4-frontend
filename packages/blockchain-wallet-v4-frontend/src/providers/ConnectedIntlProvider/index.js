import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { find, propEq } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { languages } from 'services/LanguageService'

const getData = (messages, state) =>
  createDeepEqualSelector([selectors.preferences.getLanguage], language => {
    const hasLang = propEq('language', language)
    const locale = find(hasLang, languages) ? language : 'en'
    return { locale, key: locale, messages: messages[locale] }
  })(state)

const mapStateToProps = (state, ownProps) => getData(ownProps.messages, state)

export default connect(mapStateToProps)(IntlProvider)
