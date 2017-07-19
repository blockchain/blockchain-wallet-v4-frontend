import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import logo from 'img/blockchain-vector.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #004A7C;
  width: 100%;
  height: 60px;
`
const Logo = styled.img.attrs({ src: logo })`
  height: 20px;
`

const Header = () => {
  return (
    <Wrapper>
      <NavLink to='/'>
        <Logo />
      </NavLink>
    </Wrapper>
  )
}

export default Header
