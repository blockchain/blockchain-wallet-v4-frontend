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

  &:before {
    font-family: 'icomoon';
    content: '${props => props.code}';
  }
`

const Icon = (props) => {
  const { name, ...rest } = props
  const code = Icomoon[name]

  return <BaseIcon {...rest} code={code} />
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  color: PropTypes.oneOf(keysIn(Palette()))
}

Icon.defaultProps = {
  weight: 400,
  size: '16px',
  color: 'text'
}

export default Icon
