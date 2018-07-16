import React from 'react'
import styled from 'styled-components'

import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

const CoinifyCheckoutContainer = (props) => {
  const { type, options, value } = props
  return (
    <Wrapper>
      <Content type={type} options={options} value={value} />
    </Wrapper>
  )
}

export default CoinifyCheckoutContainer
