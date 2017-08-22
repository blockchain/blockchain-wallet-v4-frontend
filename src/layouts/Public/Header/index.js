import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Image } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #004A7C;
  width: 100%;
  height: 60px;
`

const Header = () => {
  return (
    <Wrapper>
      <NavLink to='/'>
        <Image name='blockchain-vector' height='20px' />
      </NavLink>
    </Wrapper>
  )
}

export default Header
