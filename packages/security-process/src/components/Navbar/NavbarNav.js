import React from 'react'
import styled from 'styled-components'
import media from 'services/ResponsiveService'

const BaseNav = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
  list-style-type: none;
  ${media.tablet`
    padding: 0 10px;
  `};
`

const NavbarNav = props => {
  const { children, ...rest } = props

  return <BaseNav {...rest}>{children}</BaseNav>
}

export default NavbarNav
