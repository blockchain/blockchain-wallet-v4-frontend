import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'

const BaseToggler = styled.button`
  position: absolute;
  top: 50%;
  margin-top: -19px;
  right: 10px;
  display: block;
  cursor: pointer;
  padding: 10px;
  background-color: transparent;
  border: none;

  @media(min-width: 768px) { display: none; }

  &:focus { outline: none; }
`
const TogglerButton = styled(Icon)`
  color: ${props => props.theme['white']};
`

const NavbarToggler = props => {
  const { onToggle, toggled } = props
  const name = toggled ? 'close' : 'hamburger-menu'

  return (
    <BaseToggler onClick={onToggle}>
      <TogglerButton name={name} size='24px' />
    </BaseToggler>
  )
}

NavbarToggler.propTypes = {
  onToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool
}

NavbarToggler.defaultProps = {
  toggled: false
}

export default NavbarToggler
