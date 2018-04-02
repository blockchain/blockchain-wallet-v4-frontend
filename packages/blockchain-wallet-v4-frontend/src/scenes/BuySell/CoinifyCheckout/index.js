import React from 'react'
import styled from 'styled-components'

import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

const CoinifyCheckoutContainer = (props) => {
  return (
    <Wrapper>
      <Content {...props} />
    </Wrapper>
  )
}

export default CoinifyCheckoutContainer
