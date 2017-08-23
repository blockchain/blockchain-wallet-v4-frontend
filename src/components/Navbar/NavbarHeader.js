import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseHeader = styled.div`

`

const NavbarHeader = props => {
  const { children, ...rest } = props

  return (
    <BaseHeader {...rest}>
      {children}
    </BaseHeader>
  )
}

export default NavbarHeader
