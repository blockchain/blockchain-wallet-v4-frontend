import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: red;
  padding: 12px;
`

const Navbar = () => {
  return (
    <NavContainer>
      <Icon color='#3D89F5' name='blockchain' size='lg' />
    </NavContainer>
  )
}

type Props = {}

export default Navbar
