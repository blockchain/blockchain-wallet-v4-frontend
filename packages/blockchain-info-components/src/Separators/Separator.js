import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  fle-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  & > :first-child { width: 100%; }
  & > :last-child { width: 100%; }
  & > :not(:first-child):not(:last-child) { white-space: nowrap; padding: 0 10px; }
`

const BaseSeparator = styled.div`
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  margin: 10px 0;
`

const Separator = props => {
  const { children } = props

  return children
    ? <Wrapper><BaseSeparator />{ children }<BaseSeparator /></Wrapper>
    : <BaseSeparator />
}

export default Separator
