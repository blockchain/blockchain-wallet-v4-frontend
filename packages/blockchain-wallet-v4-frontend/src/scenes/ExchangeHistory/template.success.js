import React from 'react'
import PropTypes from 'prop-types'

import Empty from './Empty'
import List from './List'

const Success = props => {
  const {
    complete,
    incomplete,
    showComplete,
    showIncomplete,
    loadingNextPage,
    onScrollPastFinish
  } = props

  return !showComplete && !showIncomplete ? (
    <Empty />
  ) : (
    <List
      complete={complete}
      incomplete={incomplete}
      showComplete={showComplete}
      showIncomplete={showIncomplete}
      loadingNextPage={loadingNextPage}
      onScrollPastFinish={onScrollPastFinish}
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
