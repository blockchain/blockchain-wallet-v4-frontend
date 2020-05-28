import React from 'react'
import styled from 'styled-components'

const BaseNavItem = styled.li`
  box-sizing: border-box;
  padding: 0px 16px;
  cursor: pointer;
  &:first-child {
    padding-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }
`

const NavbarNavItem = props => {
  const { children, ...rest } = props

  return <BaseNavItem {...rest}>{children}</BaseNavItem>
}

export default NavbarNavItem
