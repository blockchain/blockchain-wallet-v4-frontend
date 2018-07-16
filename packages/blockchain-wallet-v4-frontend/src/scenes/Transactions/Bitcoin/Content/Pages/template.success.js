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
`

const Success = props => {
  return (
    <Wrapper>
      {props.transactions.map((transaction, index) => (
        <TransactionListItem
          key={transaction.hash}
          transaction={transaction}
          coin="BTC"
          minConfirmations={3}
          buysellPartner={props.buysellPartner}
        />
      ))}
    </Wrapper>
  )
}

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
