import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { take } from 'ramda'

const mapStateToProps = (state, props) => {
  let locale = take(2, state.preferences.culture)
  return { locale, key: locale, messages: props.messages[locale] }
}

export default connect(mapStateToProps)(IntlProvider)
