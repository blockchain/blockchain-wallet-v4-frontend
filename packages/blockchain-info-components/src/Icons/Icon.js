import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Image } from '../..'
import Icomoon from './Icomoon'

const BaseIcon = styled.span`
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  color: ${props => props.theme[props.color] || props.color};
  -webkit-font-smoothing: antialiased;
  cursor: ${props => (props.cursorEnabled ? 'pointer' : 'inherit')};
  display: flex;
  * {
    color: red !important;
  }

  &:before {
    font-family: 'icomoon', sans-serif;
    content: '${props => props.code}';
  }
`

const Icon = props => {
  const { cursor, name, ...rest } = props
  const code = Icomoon[name]

  // TODO: move off fonts for icons as they can only be one color. WDGLD needs multiple colors and thus this hack
  if (name === 'wdgld') {
    return (
      <BaseIcon {...props}>
        <Image
          height={props.height || props.size || '32px'}
          name='wdgld'
          width={props.width || props.size || '32px'}
        />
      </BaseIcon>
    )
  }

  return <BaseIcon {...rest} code={code} cursorEnabled={cursor} />
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  cursor: PropTypes.bool
}

Icon.defaultProps = {
  weight: 400,
  size: '16px',
  color: 'grey700',
  cursor: false
}

export default Icon
