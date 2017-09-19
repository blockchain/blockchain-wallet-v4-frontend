import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

const BaseNavbarDropdown = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 15px;
  height: inherit;
  width: inherit;
  background-color: inherit;
  overflow: auto;
  position: absolute;
  left: 0;
  top: 39px;
  z-index: 10;

  & > a {
    color: ${props => transparentize(0.41, (props.theme['white']))}!important;
  }
`

const NavbarDropdown = props => {
  const { children } = props

  return (
    <BaseNavbarDropdown>
      {children}
    </BaseNavbarDropdown>
  )
}

export default NavbarDropdown
