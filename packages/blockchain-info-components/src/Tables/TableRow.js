import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 15px;
  box-sizing: border-box;
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-top: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
`

const TableRow = ({ children, className }) => (
  <Wrapper border padding className={className}>
    {children}
  </Wrapper>
)

export default TableRow
