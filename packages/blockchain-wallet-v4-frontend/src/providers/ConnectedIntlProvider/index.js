import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const getData = (messages, state) => createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  (language) => {
    const locale = language || 'en'
    return { locale, key: locale, messages: messages[locale] }
  }
)(state)

const mapStateToProps = (state, ownProps) => getData(ownProps.messages, state)

export default connect(mapStateToProps)(IntlProvider)
