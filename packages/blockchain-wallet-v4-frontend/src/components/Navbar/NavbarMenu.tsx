import React from 'react'
import styled from 'styled-components'

const BaseMenu = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

const NavbarMenu = props => {
  const { children, ...rest } = props

  return <BaseMenu {...rest}>{children}</BaseMenu>
}

NavbarMenu.defaultProps = {
  toggled: false
}

export default NavbarMenu
