import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  @media(min-width: 1200px) { width: auto; }
`

const TransactionDetailsValue = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionDetailsValue
