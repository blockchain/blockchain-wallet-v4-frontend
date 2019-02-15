import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Palette } from '../Colors'
import { keysIn } from 'ramda'

const BaseText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  text-transform: ${props =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => (props.italic ? 'italic' : 'normal')};
  color: ${props => props.theme[props.color]};
  cursor: ${props => props.cursor};
  flex-direction: ${props => (props.flexRow ? 'row' : null)};
  display: ${props => (props.flexRow ? 'flex' : 'block')};
  opacity: ${props => props.opacity};
`

const Text = ({ children, ...props }) => {
  return (
    <BaseText data-e2e={props['data-e2e']} {...props}>
      {children}{' '}
    </BaseText>
  )
}

Text.propTypes = {
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  italic: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  altFont: PropTypes.bool,
  cursor: PropTypes.string,
  opacity: PropTypes.number
}

Text.defaultProps = {
  weight: 400,
  size: '16px',
  uppercase: false,
  capitalize: false,
  italic: false,
  color: 'gray-5',
  altFont: false,
  cursor: 'inherit',
  opacity: 1
}

export default Text
