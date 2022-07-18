import React from 'react'
import styled from 'styled-components'
import Balance from './Balance'
import CoinsVirtList from './CoinsVirtList'

const Wrapper = styled.div`
  height: 100%;
`

const CoinList = () => {
  return (
    <Wrapper>
      <Balance />
      <CoinsVirtList />
    </Wrapper>
  )
}

export default CoinList
