import Empty from './Empty'
import List from './List'
import PropTypes from 'prop-types'
import React from 'react'

const Success = props => {
  const {
    coinModels,
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
      coinModels={coinModels}
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
