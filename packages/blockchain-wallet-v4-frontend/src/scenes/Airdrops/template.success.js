import AirdropInfo from './AirdropInfo'
import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  > div {
    margin-right: 24px;
    &:last-child {
      margin-right: 0px;
    }
  }
`

const Success = props => {
  return (
    <Container>
      <AirdropInfo {...props} />
    </Container>
  )
}

export default Success
