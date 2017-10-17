import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;

  @media(min-width: 1200px) { display: flex; }
`

const TransactionRowDescription = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionRowDescription
