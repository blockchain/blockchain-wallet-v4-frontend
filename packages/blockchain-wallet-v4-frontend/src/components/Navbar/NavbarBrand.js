import React from 'react'
import styled from 'styled-components'

const BaseBrand = styled.div`
  display: flex;
  padding-left: 25px;
  @media (min-width: 768px) {
    > span:first-child {
      display: none;
    }
  }
`

const NavbarBrand = props => {
  const { children, ...rest } = props

  return (
    <BaseBrand {...rest}>
      {children}
    </BaseBrand>
  )
}

export default NavbarBrand
