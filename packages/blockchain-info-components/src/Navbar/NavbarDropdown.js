import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

const BaseNavbarDropdown = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 0;
  height: inherit;
  width: auto;
  min-width: 110px;
  background-color: inherit;
  overflow: auto;

  & a {
    color: ${props => transparentize(0.41, (props.theme['white']))}!important;
    font-weight: 300!important;
    margin-bottom: 5px;
  }

  @media(min-width: 768px) {
    position: absolute;
    left: 0;
    top: 39px;
    padding: 10px 15px;
    z-index: 10;
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
