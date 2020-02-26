import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 8px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey000};
`

const TableHeader = ({ children }) => <Wrapper>{children}</Wrapper>

export default TableHeader
