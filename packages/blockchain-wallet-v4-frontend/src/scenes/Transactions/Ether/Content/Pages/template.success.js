import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

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
      {props.transactions.map((transaction, index) => <TransactionListItem key={index} transaction={transaction} coin='ETH' minConfirmations={12} />)}
    </Wrapper>
  )
}

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
