import React from 'react'
import PropTypes from 'prop-types'

import Empty from './Empty'
import List from './List'

const Success = props => {
  const { complete, incomplete, showComplete, showIncomplete } = props.trades

  return !showComplete && !showIncomplete
    ? <Empty />
    : <List complete={complete} incomplete={incomplete} showComplete={showComplete} showIncomplete={showIncomplete} />
}

Success.propTypes = {
  trades: PropTypes.array
}

export default Success
