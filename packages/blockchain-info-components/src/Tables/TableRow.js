import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey000};
`

const TableRow = ({ children, className, ...rest }) => (
  <Wrapper {...rest} border padding className={className}>
    {children}
  </Wrapper>
)

export default TableRow
