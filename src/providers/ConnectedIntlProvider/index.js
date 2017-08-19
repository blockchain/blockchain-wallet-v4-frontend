import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
  const locale = state.preferences.language || 'en'

  return { locale, key: locale, messages: props.messages[locale] }
}

export default connect(mapStateToProps)(IntlProvider)
