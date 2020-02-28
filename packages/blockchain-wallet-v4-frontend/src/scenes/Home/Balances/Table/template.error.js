import DataError from 'components/DataError'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 24px;
`

export default props => (
  <Wrapper>
    <DataError onClick={props.handleRefresh} />
  </Wrapper>
)
