import React from 'react'
import PropTypes from 'prop-types'
import { keysIn } from 'ramda'
import styled from 'styled-components'

import { Palette } from '../Colors/index.ts'

const BaseLink = styled.a`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${(props) => props.size};
  font-weight: ${(props) => props.weight};
  color: ${(props) => props.theme[props.color]};
  text-transform: ${(props) =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme[props.color]};
  }

  &:focus {
    text-decoration: none;
  }
`

const Link = (props) => {
  const { children, ...rest } = props

  return <BaseLink {...rest}>{children}</BaseLink>
}

Link.propTypes = {
  bold: PropTypes.bool,
  capitalize: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  size: PropTypes.string,
  uppercase: PropTypes.bool,
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900])
}

Link.defaultProps = {
  bold: false,
  capitalize: false,
  color: 'blue600',
  size: '16px',
  uppercase: false,
  weight: 500
}

export default Link
