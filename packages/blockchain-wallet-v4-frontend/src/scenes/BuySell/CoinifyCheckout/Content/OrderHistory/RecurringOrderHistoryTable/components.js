import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 8px 5px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-top: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const TableRowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 5px;
  box-sizing: border-box;
  border: none;
`

export const RecurringTableHeader = ({ children }) => (
  <Wrapper>{children}</Wrapper>
)

export const RecurringTableRow = ({ children }) => (
  <TableRowWrapper>{children}</TableRowWrapper>
)
