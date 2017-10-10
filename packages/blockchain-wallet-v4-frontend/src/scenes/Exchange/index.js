import React from 'react'
import styled from 'styled-components'

import Exchange from './template.js'
import MenuTop from './MenuTop'

const Wrapper = styled.div`
  width: 100%;
`

class ExchangeContainer extends React.Component {
  render () {
    return (
      <Wrapper>
        <MenuTop />
        <Exchange />
      </Wrapper>
    )
  }
}

export default ExchangeContainer
