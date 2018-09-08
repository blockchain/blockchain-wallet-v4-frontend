import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose, prop, reverse, sortBy } from 'ramda'

import TransactionListItem2 from 'components/TransactionListItem2'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

const sortByTime = compose(
  reverse,
  sortBy(prop('time'))
)

const Success = props => {
  return (
    <Wrapper>
      {sortByTime(props.transactions).map((transaction, index) => (
        <TransactionListItem2
          key={transaction.hash}
          coin={transaction.coin}
          currency={props.currency}
          transaction={transaction}
          minConfirmations={3}
        />
      ))}
      <div onClick={() => props.loadMore()}>Load More</div>
    </Wrapper>
  )
}

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
