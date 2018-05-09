import React from 'react'
import PropTypes from 'prop-types'

import ExchangeLayout from 'layouts/Exchange'
import Empty from './Empty'
import List from './List'

const Success = props => {
  const { complete, incomplete, showComplete, showIncomplete } = props.trades

  return (
    <ExchangeLayout>
      { !showComplete && !showIncomplete
        ? <Empty />
        : <List complete={complete} incomplete={incomplete} showComplete={showComplete} showIncomplete={showIncomplete} />
      }
    </ExchangeLayout>
  )
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
