import React from 'react'
import styled from 'styled-components'

const BaseBrand = styled.div`
  padding-left: 25px;
  > a {
    height: 20px;
    display: block;
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
