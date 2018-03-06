import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 8px;

  @media(min-width: 1200px) { width: auto; }
`

const TransactionDetailsValue = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionDetailsValue
