import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as ReactRouterDom from 'react-router-dom'
import { Text } from 'components/Shared/Text'

const BaseNavLink = styled(ReactRouterDom.NavLink)`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
  
  &:focus {
    text-decoration: none;
  }
`

const NavLink = (props) => {
  const { to, ...rest } = props
  return (
    <BaseNavLink to={to}>
      <Text {...rest} />
    </BaseNavLink>
  )
}

NavLink.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default NavLink
