import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import List from './List'
import Empty from './Empty'

const ExchangeHistory = props => {
  const { trades } = props
  return (
    <ExchangeLayout>
      {!isNil(trades) ? <List trades={trades} /> : <Empty />}
    </ExchangeLayout>
  )
}

ExchangeHistory.propTypes = {
  trades: PropTypes.array
}

export default ExchangeHistory
