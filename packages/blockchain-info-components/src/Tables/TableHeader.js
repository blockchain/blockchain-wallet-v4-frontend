import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 8px 15px;
  box-sizing: border-box;
  background-color: ${props => props.theme['brand-quaternary']};
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-top: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
`

const TableHeader = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
)

export default TableHeader
