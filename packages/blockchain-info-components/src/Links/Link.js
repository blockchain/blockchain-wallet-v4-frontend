import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Palette } from '../Colors'
import { keysIn } from 'ramda'

const BaseLink = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.size};
  font-weight: ${props => props.weight};
  color: ${props => props.theme[props.color]};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  text-decoration: none;
  cursor : pointer;

  & > * { margin-right: 5px; }

  &:hover { 
    color: ${props => props.theme[props.color]};
  }

  &:focus { text-decoration: none; }
`

const Link = props => {
  const { children, ...rest } = props

  return (
    <BaseLink {...rest}>
      {children}
    </BaseLink>
  )
}

Link.propTypes = {
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  bold: PropTypes.bool
}

Link.defaultProps = {
  weight: 400,
  size: '16px',
  color: 'brand-secondary',
  uppercase: false,
  bold: false
}

export default Link
