import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: ${props => props.padding || '8px 15px'};
  box-sizing: border-box;
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-top: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
  border: ${props => props.border}
`

const TableRow = ({ children, border, padding }) => (
  <Wrapper border padding>
    {children}
  </Wrapper>
)

export default TableRow
