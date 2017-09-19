import React from 'react'
import styled from 'styled-components'

const BaseNavItem = styled.li`
  padding: 10px 15px;
  box-sizing: border-box;

  & > a {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme['white']};
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
  }
`

const NavbarNavItem = props => {
  const { children, ...rest } = props

  return (
    <BaseNavItem {...rest}>
      {children}
    </BaseNavItem>
  )
}

export default NavbarNavItem
