import React from 'react'
import styled from 'styled-components'

import ListItem from './ListItem'

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
      {props.transactions.map((transaction, index) => <ListItem key={index} transaction={transaction} currency={props.currency} coin='BTC' minConfirmations={300}/>)}
    </Wrapper>
  )
}

Success.propTypes = {
  // isEmpty: PropTypes.bool.isRequired,
  // transactions: PropTypes.array.isRequired
}

export default Success
