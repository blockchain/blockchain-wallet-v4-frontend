import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

const History = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
)

export default History
