import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'

import ExchangeLayout from 'layouts/Exchange'
import Empty from './Empty'
import List from './List'

const Success = props => {
  const { complete, incomplete } = props

  return (
    <ExchangeLayout>
      {isEmpty(complete) && isEmpty(incomplete)
        ? <Empty />
        : <List complete={complete} incomplete={incomplete} />
      }
    </ExchangeLayout>
  )
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
