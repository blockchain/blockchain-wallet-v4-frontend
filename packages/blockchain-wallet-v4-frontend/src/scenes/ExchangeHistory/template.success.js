import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import Empty from './Empty'
import List from './List'

const Success = props => {
  const { complete, incomplete, error } = props.trades

  return (
    <ExchangeLayout>
      {isEmpty(complete) && isEmpty(incomplete) && isEmpty(error)
        ? <Empty />
        : <List complete={complete} incomplete={incomplete} error={error} />
      }
    </ExchangeLayout>
  )
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
