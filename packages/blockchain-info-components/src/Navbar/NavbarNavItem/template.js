import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

const BaseNavbarNavItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 15px;
  width: auto;
  min-width: 110px;

  & > a {
    font-size: 14px;
    font-weight: 300;
    color: ${props => props.theme['white']}!important;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
  }

  @media(min-width: 768px) {
    background-color:  ${props => props.hovered ? transparentize(0.7, (props.theme['white'])) : 'transparent'};
    position: relative;

    & :not(:first-child):last-child {
      display:  ${props => props.hovered ? 'block' : 'none'};
    }
  }
`

const NavbarNavItem = props => {
  const { children, hovered, handleMouseOver, handleMouseOut, ...rest } = props

  return (
    <BaseNavbarNavItem onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} hovered={hovered && children.length > 1} {...rest}>
      {children}
    </BaseNavbarNavItem>
  )
}

export default NavbarNavItem
