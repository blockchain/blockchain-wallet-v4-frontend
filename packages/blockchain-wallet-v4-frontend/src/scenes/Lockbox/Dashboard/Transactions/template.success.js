import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { compose, isEmpty, prop, reverse, sortBy } from 'ramda'

import { Text } from 'blockchain-info-components'
import EmptyTx from 'components/EmptyTx'
import TransactionListItem from 'components/TransactionListItem'
import Loading from './template.loading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const LoadMore = styled(Text)`
  width: 100%;
  text-align: center;
  margin: 20px 0;
  > span {
    cursor: pointer;
    transition: color 0.3s;
    text-decoration: underline;
    &:hover {
      color: ${props => props.theme['brand-secondary']};
    }
  }
`
const sortByTime = compose(
  reverse,
  sortBy(prop('time'))
)

const Success = props => {
  const { transactions, isLoading, searchesApplied } = props

  return (
    <Wrapper>
      {isLoading && <Loading />}
      {sortByTime(transactions).map(transaction => (
        <TransactionListItem
          key={transaction.hash}
          coin={transaction.coin}
          currency={props.currency}
          transaction={transaction}
        />
      ))}
      {!isLoading &&
        isEmpty(transactions) &&
        !isEmpty(searchesApplied) && <EmptyTx />}
      {!isLoading &&
        !isEmpty(transactions) && (
          <LoadMore onClick={() => props.loadMore()}>
            <FormattedMessage
              id='scenes.lockbox.dashboard.transactions.loadmore'
              defaultMessage='Load More Transactions'
            />
          </LoadMore>
        )}
    </Wrapper>
  )
}

Success.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  searchesApplied: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired
}

export default Success
