import React from 'react'

import ExchangeLayout from 'layouts/Exchange'
import ExchangeHistory from './template.js'

class ExchangeHistoryContainer extends React.Component {
  render () {
    return (
      <ExchangeLayout>
        <ExchangeHistory />
      </ExchangeLayout>
    )
  }
}

export default ExchangeHistoryContainer
