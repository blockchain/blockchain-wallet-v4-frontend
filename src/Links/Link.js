import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DefaultColor } from '../Colors'

const BaseLink = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.size};
  font-weight: ${props => props.weight};
  color: ${props =>
    props.color === 'gray' ? DefaultColor.text
    : props.color === 'cyan' ? DefaultColor.iris
    : props.color === 'white' ? DefaultColor.white
    : props.color === 'medium-blue' ? DefaultColor.balihai : DefaultColor.blue};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  text-decoration: none;
  cursor : pointer;

  & > * { margin-right: 5px; }

  &:hover { 
    color: ${props =>
    props.color === 'gray' ? DefaultColor.text
    : props.color === 'cyan' ? DefaultColor.iris
    : props.color === 'white' ? DefaultColor.white
    : props.color === 'medium-blue' ? DefaultColor.balihai : DefaultColor.iris};
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
  color: PropTypes.oneOf(['cyan', 'white', 'medium-blue', 'gray']),
  uppercase: PropTypes.bool
}

Link.defaultProps = {
  weight: 400,
  size: '16px',
  color: 'cyan',
  uppercase: false
}

export default Link
