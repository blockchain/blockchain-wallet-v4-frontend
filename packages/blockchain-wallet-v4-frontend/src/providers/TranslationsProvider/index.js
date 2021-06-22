import React from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import { any, includes, propOr } from 'ramda'

import { selectors } from 'data'
import { languages, loadLocaleData } from 'services/locales'

class TranslationsProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locale: 'en',
      messages: {}
    }
  }

  // ⚠️ HACK ALERT ⚠️
  // Since email auth/magic links invalidate themselves when rendered more than once,
  // updating the default language (english) to the users actual language causes
  // the authorize and verify email pages to re-render which will then invalidate
  // the links.  Users are then unable to log into their wallets. This is a hack
  // to prevent the language update to cause a re-render on these pages. The downside
  // is that these pages will never be translated.
  componentDidUpdate(prevProps) {
    const urlHash = window.location.hash
    if (
      this.props.locale !== prevProps.locale &&
      !includes('authorize-approve', urlHash) &&
      !includes('verify-email', urlHash)
    ) {
      this.initLocale()
    }
  }

  initLocale = () => {
    const locale = any(propOr('en', this.props.locale), languages) ? this.props.locale : 'en'
    loadLocaleData(locale, (messages) => {
      this.setState({ locale, messages })
    })
  }

  render() {
    const { locale, messages } = this.state
    return (
      <IntlProvider
        locale={locale}
        key={locale}
        messages={messages}
        defaultRichTextElements={{
          a: (chunks) => <a>{chunks}</a>,
          b: (chunks) => <b>{chunks}</b>,
          br: () => <br />,
          p: (chunks) => <p>{chunks}</p>
        }}
      >
        {this.props.children}
      </IntlProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  locale: selectors.preferences.getLanguage(state)
})

export default connect(mapStateToProps)(TranslationsProvider)
