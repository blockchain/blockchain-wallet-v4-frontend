import React from 'react'
import styled from 'styled-components'

import TransactionListItem from '../../../../components/TransactionListItem'
import { PropTypes } from './'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  &:last-child {
    > div {
      border: none;
    }
  }
`

const Success = (props: PropTypes) => (
  <Wrapper>
    {props.transactions.map(transaction => {
      return (
        <TransactionListItem
          key={transaction.hash}
          transaction={transaction}
          coin={props.coin}
          currency={props.currency}
          buySellPartner={props.buySellPartner}
        />
      )
    })}
  </Wrapper>
)

export default Success
