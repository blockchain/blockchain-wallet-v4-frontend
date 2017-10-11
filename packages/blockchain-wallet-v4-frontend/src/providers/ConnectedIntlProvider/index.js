import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { selectors } from 'data'

const mapStateToProps = (state, props) => {
  const locale = selectors.preferences.getLanguage(state) || 'en'

  return { locale, key: locale, messages: props.messages[locale] }
}

export default connect(mapStateToProps)(IntlProvider)
