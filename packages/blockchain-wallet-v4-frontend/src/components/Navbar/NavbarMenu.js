import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseMenu = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const NavbarMenu = props => {
  const { children, ...rest } = props

  return (
    <BaseMenu {...rest}>
      {children}
    </BaseMenu>
  )
}

NavbarMenu.propTypes = {
  toggled: PropTypes.bool
}

NavbarMenu.defaultProps = {
  toggled: false
}

export default NavbarMenu
