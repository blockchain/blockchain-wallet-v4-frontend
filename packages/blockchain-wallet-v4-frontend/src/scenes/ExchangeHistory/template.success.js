import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import List from './List'
import Empty from './Empty'

const ExchangeHistory = props => {
  const { exchangeHistory } = props
  const trades = exchangeHistory
  return (
    <ExchangeLayout>
      {!isNil(trades) ? <List exchangeHistory={exchangeHistory} /> : <Empty />}
    </ExchangeLayout>
  )
}

ExchangeHistory.propTypes = {
  trades: PropTypes.array
}

export default ExchangeHistory
