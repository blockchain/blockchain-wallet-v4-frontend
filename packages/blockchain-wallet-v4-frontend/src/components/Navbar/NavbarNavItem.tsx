import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const BaseNavItem = styled.li`
  box-sizing: border-box;
  margin-right: 8px;
  cursor: pointer;
  &:last-child {
    margin-right: 0px;
  }

  ${media.tablet`
    min-width: 26px;
    > a  > span,
    > div > a  > span {
      font-size: 18px;
    }
  `};
`

const NavbarNavItem = props => {
  const { children, ...rest } = props

  return <BaseNavItem {...rest}>{children}</BaseNavItem>
}

export default NavbarNavItem
