import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TransactionListItem from 'components/TransactionListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  & > :last-child {
    > div {
      border: none;
    }
  }
`

const getMinConfirms = coin => {
  switch (coin) {
    case 'ETH':
      return 12
    case 'XLM':
      return 1
    default:
      return 3
  }
}

const Success = props => (
  <Wrapper>
    {props.transactions.map(transaction => (
      <TransactionListItem
        key={transaction.hash}
        transaction={transaction}
        coin={props.coin}
        minConfirmations={getMinConfirms(props.coin)}
        currency={props.currency}
        buySellPartner={props.buySellPartner}
      />
    ))}
  </Wrapper>
)

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
