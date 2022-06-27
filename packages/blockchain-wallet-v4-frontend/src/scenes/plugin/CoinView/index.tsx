import React from 'react'
import styled from 'styled-components'

import CoinsList from './CoinsList'
import Header from './Header'

const Wrapper = styled.div`
  height: 100%;
`

export const CoinView = () => {
  return (
    <Wrapper>
      <Header />
      <CoinsList />
    </Wrapper>
  )
}

export default CoinView
