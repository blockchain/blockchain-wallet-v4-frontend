import React from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'

class TranslationsProvider extends React.Component {
  render () {
    const { locale, key, messages } = this.props.data
    return (
      <IntlProvider locale={locale} key={key} messages={messages}>
        {this.props.children}
      </IntlProvider>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(TranslationsProvider)
