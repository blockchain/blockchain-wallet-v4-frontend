import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Text } from 'components/Shared/Text'

const BaseRouterLink = styled(NavLink)`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
  
  &:focus {
    text-decoration: none;
  }
`

const RouterLink = (props) => {
  const { to, ...rest } = props
  return (
    <BaseRouterLink to={to}>
      <Text {...rest} />
    </BaseRouterLink>
  )
}

RouterLink.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default RouterLink
