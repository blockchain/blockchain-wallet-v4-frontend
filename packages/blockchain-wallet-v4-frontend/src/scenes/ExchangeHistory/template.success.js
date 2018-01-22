import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import Empty from './Empty'
import List from './List'

const Success = props => {
  const { trades } = props

  return (
    <ExchangeLayout>
      {!isNil(trades)
        ? <List trades={trades} />
        : <Empty />
      }
    </ExchangeLayout>
  )
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
