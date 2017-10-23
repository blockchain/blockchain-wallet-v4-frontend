import React from 'react'
import styled from 'styled-components'

import Menu from './Menu'
import List from './List'

const Wrapper = styled.div`
  width: 100%;
`

const EtherTransactionsContainer = (props) => {
  return (
    <Wrapper>
      <Menu />
      <List />
    </Wrapper>
  )
}

export default EtherTransactionsContainer
