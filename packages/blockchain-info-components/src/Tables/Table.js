import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  & > :last-child {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
`

const Table = ({ children, dataE2e }) => (
  <Wrapper data-e2e={dataE2e}>{children}</Wrapper>
)

export default Table
