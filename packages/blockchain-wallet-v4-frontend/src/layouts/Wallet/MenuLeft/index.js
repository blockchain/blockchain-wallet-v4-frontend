import React from 'react'
import styled from 'styled-components'

import Footer from './Footer'
import Navigation from './Navigation'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const MenuLeft = (props) => {
  return (
    <Wrapper>
      <Navigation {...props} />
      <Footer />
    </Wrapper>
  )
}

export default MenuLeft
