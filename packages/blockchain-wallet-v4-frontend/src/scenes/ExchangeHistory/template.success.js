import React from 'react'
import PropTypes from 'prop-types'
import { and, isEmpty, map, reduce, values } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import Empty from './Empty'
import List from './List'

const Success = props => {
  const { trades } = props

  return (
    <ExchangeLayout>
      {reduce(and, true, map(isEmpty, values(trades)))
        ? <Empty />
        : <List trades={trades} />
      }
    </ExchangeLayout>
  )
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
