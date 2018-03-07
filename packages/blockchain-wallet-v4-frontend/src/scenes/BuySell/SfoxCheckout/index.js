import React from 'react'
import styled from 'styled-components'

import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

const SfoxCheckoutContainer = (props) => {
  return (
    <Wrapper>
      <Content {...props} />
    </Wrapper>
  )
}

export default SfoxCheckoutContainer
