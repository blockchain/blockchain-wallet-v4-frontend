import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: ${props => props.toggled ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start
  align-items: flex-start;
  width: 100%;
  margin-top: 15px;
  & > * { margin-top: 10px; }

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const TransactionRow = props => (
  <Wrapper {...props}>
    {props.children}
  </Wrapper>
)

export default TransactionRow
