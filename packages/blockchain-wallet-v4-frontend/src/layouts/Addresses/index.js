import React from 'react'
import styled from 'styled-components'

import MenuTop from './MenuTop'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const AddressesLayout = props => {
  const { location, children } = props

  return (
    <Wrapper location={location}>
      <MenuTop />
      {children}
    </Wrapper>
  )
}

export default AddressesLayout
