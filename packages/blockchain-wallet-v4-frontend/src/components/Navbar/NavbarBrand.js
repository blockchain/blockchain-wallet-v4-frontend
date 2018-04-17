import React from 'react'
import styled from 'styled-components'

const BaseBrand = styled.div`
  padding-left: 40px;
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
