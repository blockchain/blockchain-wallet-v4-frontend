import React from 'react'
import PropTypes from 'prop-types'

import Empty from './Empty'
import List from './List'

const Success = props => {
  const { complete, incomplete, showComplete, showIncomplete } = props

  return !showComplete && !showIncomplete ? (
    <Empty />
  ) : (
    <List
      complete={complete}
      incomplete={incomplete}
      showComplete={showComplete}
      showIncomplete={showIncomplete}
    />
  )
}

Success.propTypes = {
  complete: PropTypes.array.isRequired,
  incomplete: PropTypes.array.isRequired,
  showComplete: PropTypes.bool.isRequired,
  showIncomplete: PropTypes.bool.isRequired
}

export default Success
