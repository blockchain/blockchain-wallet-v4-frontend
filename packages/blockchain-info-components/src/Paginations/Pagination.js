import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 10px 0;
`

const Pagination = props => {
  const { children } = props
  return <Wrapper>{children}</Wrapper>
}

export default Pagination
