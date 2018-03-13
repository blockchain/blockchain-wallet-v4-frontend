import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseToggler = styled.button`
  display: block;
  cursor: pointer;
  padding: 10px;
  background-color: transparent;
  border: none;

  @media(min-width: 768px) { display: none; }
`
const BaseTogglerBar = styled.span`
  display: block;
  height: 2px;
  margin-top: 4px;
  border-radius: 1px;
  background-color: ${props => props.theme['white']};
`

const NavbarToggler = props => {
  const { onToggle } = props

  return (
    <BaseToggler onClick={onToggle}>
      <BaseTogglerBar />
      <BaseTogglerBar />
      <BaseTogglerBar />
    </BaseToggler>
  )
}

NavbarToggler.propTypes = {
  onToggle: PropTypes.func.isRequired
}

export default NavbarToggler
