import React from 'react'
import styled from 'styled-components'

import MenuTop from './MenuTop'
import List from './template.js'

const Wrapper = styled.div`
  width: 100%;
`

const EtherTransactionsContainer = (props) => {
  return (
    <Wrapper>
      <MenuTop />
      <List />
    </Wrapper>
  )
}

export default EtherTransactionsContainer
