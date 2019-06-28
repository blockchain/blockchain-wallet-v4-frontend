import React from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { any, propOr } from 'ramda'

import { languages, loadLocaleData } from 'services/LocalesService'
import { selectors } from 'data'

class TranslationsProvider extends React.Component {
  state = {
    locale: '',
    messages: {}
  }

  componentDidUpdate (prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.initLocale()
    }
  }

  initLocale = () => {
    const locale = any(propOr('en', this.props.locale), languages)
      ? this.props.locale
      : 'en'
    loadLocaleData(locale, messages => {
      this.setState({ messages, locale })
    })
  }

  render () {
    const { locale, messages } = this.state
    return (
      <IntlProvider locale={locale} key={locale} messages={messages}>
        {this.props.children}
      </IntlProvider>
    )
  }
}

const mapStateToProps = state => ({
  locale: selectors.preferences.getLanguage(state)
})

export default connect(mapStateToProps)(TranslationsProvider)
