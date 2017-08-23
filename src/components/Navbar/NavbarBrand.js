import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseBrand = styled.div`
  padding: 0 20px;
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
