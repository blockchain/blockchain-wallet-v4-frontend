import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`

const HistoryRow = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
)

export default HistoryRow
