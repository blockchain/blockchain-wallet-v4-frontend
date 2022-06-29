import React from 'react'
import styled from 'styled-components'

import CoinsVirtList from './CoinsVirtList'
import Header from './Header'

const Wrapper = styled.div`
  height: 100%;
  padding: 70px 20px 70px 20px;
`

const CoinList = () => {
  return (
    <Wrapper>
      <Header />
      <CoinsVirtList />
    </Wrapper>
  )
}

export default CoinList
