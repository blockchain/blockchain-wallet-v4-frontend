import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const TransactionRow = props => (
  <Wrapper>
    {props.children}
  </Wrapper>
)

export default TransactionRow
