import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'
import Icomoon from './Icomoon'

const BaseIcon = styled.span`
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  color: ${props =>
    props.color === 'cyan' ? DefaultColor.iris
    : props.color === 'medium-blue' ? DefaultColor.balihai
    : props.color === 'white' ? DefaultColor.white
    : props.color === 'dark-blue' ? DefaultColor.blue
    : props.color === 'red' ? DefaultColor.mahogany : DefaultColor.text};

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
  color: PropTypes.oneOf(['red', 'white', 'cyan', 'medium-blue', 'dark-blue'])
}

Icon.defaultProps = {
  weight: 400,
  size: '16px'
}

export default Icon
