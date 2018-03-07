import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ListItem from 'components/TransactionListItem'

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
      {props.transactions.map((transaction, index) => <ListItem key={index} transaction={transaction} coin='BTC' minConfirmations={300}/>)}
    </Wrapper>
  )
}

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
