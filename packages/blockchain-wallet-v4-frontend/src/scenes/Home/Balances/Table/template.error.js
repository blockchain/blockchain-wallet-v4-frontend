import React from 'react'
import styled from 'styled-components'
import DataError from 'components/DataError'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`

export default props => (
  <Wrapper>
    <DataError onClick={props.handleRefresh} />
  </Wrapper>
)
