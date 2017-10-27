import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 10%;
  min-width: 200px;
`

const TransactionRowAmount = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionRowAmount
