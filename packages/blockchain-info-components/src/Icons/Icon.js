import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Palette } from '../Colors'
import Icomoon from './Icomoon'
import { keysIn } from 'ramda'

const BaseIcon = styled.span`
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  color: ${props => props.theme[props.color]};
  -webkit-font-smoothing: antialiased;
  cursor: ${props => props.cursorEnabled ? 'pointer' : 'default'};
  display: flex;

  &:before {
    font-family: 'icomoon';
    content: '${props => props.code}';
  }
`

const Icon = (props) => {
  const { name, cursor, ...rest } = props
  const code = Icomoon[name]

  return <BaseIcon {...rest} code={code} cursorEnabled={cursor} />
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  color: PropTypes.oneOf(keysIn(Palette())),
  cursor: PropTypes.bool
}

Icon.defaultProps = {
  weight: 400,
  size: '16px',
  color: 'gray-5',
  cursor: false
}

export default Icon
