import React from 'react'
import styled from 'styled-components'

import CoinsList from './CoinsList'

const Wrapper = styled.div`
  height: 400px;
`

const CoinView = () => {
  return (
    <Wrapper>
      <CoinsList />
    </Wrapper>
  )
}

export default CoinView
