import React from 'react'
import styled from 'styled-components'

const BaseNav = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
  list-style-type: none;
  
  @media(min-width: 768px) { 
    flex-direction: row;
    align-items: center;
  }
`

const NavbarNav = props => {
  const { children, ...rest } = props

  return (
    <BaseNav {...rest}>
      {children}
    </BaseNav>
  )
}

export default NavbarNav
