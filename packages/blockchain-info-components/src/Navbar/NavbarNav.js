import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseNav = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style-type: none;

  @media(max-width: 767px) {
    justify-content: space-around;
  }
  
  @media(min-width: 768px) {
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    width: auto;
    ${props => props.alignRight ? 'position: absolute; right: 0;' : ''};
  }
`

const NavbarNav = props => {
  const { align, children, ...rest } = props

  return (
    <BaseNav {...rest}>
      {children}
    </BaseNav>
  )
}

NavbarNav.defaultProps = {
  alignRight: false
}

NavbarNav.propTypes = {
  alignRight: PropTypes.bool.isRequired
}

export default NavbarNav
