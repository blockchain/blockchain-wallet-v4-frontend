import React from 'react'
import styled from 'styled-components'

import { Grid } from 'components/Shared/Grid'
import logo from 'img/blockchain-vector.svg'

const HeaderWrapper = styled.div`
  background-color: #004A7C;
  height: 60px;
`
const HeaderContainer = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`
const HeaderLogo = styled.img.attrs({ src: logo })`
  height: 20px;
`

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <a href='/'>
          <HeaderLogo />
        </a>
      </HeaderContainer>
    </HeaderWrapper>
  )
}

export default Header
