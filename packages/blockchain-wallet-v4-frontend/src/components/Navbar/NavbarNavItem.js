import React from 'react'
import styled from 'styled-components'
import media from 'services/ResponsiveService'

const BaseNavItem = styled.li`
  box-sizing: border-box;
  margin-right: 28px;
  cursor: pointer;
  &:last-child {
    margin-right: 0px;
  }

  & > a {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme['white']};
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: ${props => props.theme['white']};
    }
  }

  ${media.mobile`
    margin-right: 20px;
  `};
`

const NavbarNavItem = props => {
  const { children, ...rest } = props

  return <BaseNavItem {...rest}>{children}</BaseNavItem>
}

export default NavbarNavItem
