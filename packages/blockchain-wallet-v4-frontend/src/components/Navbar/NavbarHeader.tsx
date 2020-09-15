import React from 'react'
import styled from 'styled-components'

const BaseHeader = styled.div``

const NavbarHeader = props => {
  const { children, ...rest } = props

  return <BaseHeader {...rest}>{children}</BaseHeader>
}

export default NavbarHeader
