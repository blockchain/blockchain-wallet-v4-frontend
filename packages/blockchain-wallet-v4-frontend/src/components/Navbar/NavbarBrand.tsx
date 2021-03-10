import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

const BaseBrand = styled.div`
  display: flex;
  padding-left: 24px;
  align-items: center;
  width: 250px;
  > span {
    cursor: pointer;
  }
  ${media.tabletL`
    width: 200px;
    padding-left: 0px;
  `}
  ${media.tablet`
    width: auto;
  `}
`

const NavbarBrand = props => {
  const { children, ...rest } = props

  return <BaseBrand {...rest}>{children}</BaseBrand>
}

export default NavbarBrand
