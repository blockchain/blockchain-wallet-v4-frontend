import React from 'react'
import PropTypes from 'prop-types'
import { keysIn } from 'ramda'
import styled from 'styled-components'

import { Palette } from '../Colors/index.ts'

const BaseLink = styled.a`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${props => props.size};
  font-weight: ${props => props.weight};
  color: ${props => props.theme[props.color]};
  text-transform: ${props =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme[props.color]};
  }

  &:focus {
    text-decoration: none;
  }
`

const Link = props => {
  const { children, ...rest } = props

  return <BaseLink {...rest}>{children}</BaseLink>
}

Link.propTypes = {
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  bold: PropTypes.bool
}

Link.defaultProps = {
  weight: 500,
  size: '16px',
  color: 'blue600',
  uppercase: false,
  capitalize: false,
  bold: false
}

export default Link
