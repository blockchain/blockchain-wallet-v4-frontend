import React from 'react'
import PropTypes from 'prop-types'
import * as ReactRouterDom from 'react-router-dom'
import { Text } from 'components/Shared/Text'

const NavLink = (props) => {
  const { to, ...rest } = props
  return (
    <ReactRouterDom.NavLink to={to}>
      <Text {...rest} />
    </ReactRouterDom.NavLink>
  )
}

NavLink.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default NavLink
