import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose, prop, reverse, sortBy } from 'ramda'
import { Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import TransactionListItem2 from 'components/TransactionListItem2'
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
  margin: 20px 0px;
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
  const { transactions, isLoading } = props
  return (
    <Wrapper>
      {sortByTime(transactions).map((transaction, index) => (
        <TransactionListItem2
          key={transaction.hash}
          coin={transaction.coin}
          currency={props.currency}
          transaction={transaction}
        />
      ))}
      {isLoading && <Loading />}
      {!isLoading && (
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
  transactions: PropTypes.array.isRequired
}

export default Success
