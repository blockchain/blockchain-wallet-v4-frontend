import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 35%;

  @media(min-width: 992px) { display: flex; }
`

const TransactionRowAddresses = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionRowAddresses
