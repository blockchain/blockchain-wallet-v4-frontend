import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose, prop, reverse, sortBy } from 'ramda'

import TransactionListItem from 'components/TransactionListItem'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { HeartbeatLoader } from 'blockchain-info-components'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 0 15px;
  width: 100%;
`

const LoaderRow = styled.div`
  justify-content: center;
  display: flex;
  padding: 15px;
  width: 100%;
`

const sortByTime = compose(
  reverse,
  sortBy(prop('time'))
)

const Success = props => {
  const { transactions, isLoading, loadMore } = props

  return (
    <LazyLoadWrapper onLazyLoad={loadMore}>
      {sortByTime(transactions).map(transaction => (
        <TransactionListItem
          key={transaction.hash}
          coin={transaction.coin}
          currency={props.currency}
          transaction={transaction}
        />
      ))}
      {isLoading && (
        <LoaderRow>
          <HeartbeatLoader />
        </LoaderRow>
      )}
    </LazyLoadWrapper>
  )
}

Success.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  searchesApplied: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired
}

export default Success
