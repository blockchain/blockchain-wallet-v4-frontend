import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Image, { BaseImage } from '../Images/Image'
import Icomoon from './Icomoon'

const BaseIcon = styled.span`
  font-weight: ${(props) => props.weight};
  font-size: ${(props) => props.size};
  color: ${(props) => props.theme[props.color] || props.color};
  -webkit-font-smoothing: antialiased;
  cursor: ${(props) => (props.cursorEnabled ? 'pointer' : 'inherit')};
  display: flex;
  * {
    color: red !important;
  }

  &:before {
    font-family: 'icomoon', sans-serif;
    content: '${(props) => props.code}';
  }
`

const Icon = (props) => {
  const { cursor, name, ...rest } = props
  const code = Icomoon[name]

  // if coin has logo from coinfig
  if (window.coins[name]) {
    if (window.coins[name].coinfig.type.logoPngUrl) {
      return (
        <BaseIcon {...props}>
          <BaseImage
            height={props.height || props.size || '32px'}
            src={window.coins[name].coinfig.type.logoPngUrl}
            width={props.width || props.size || '32px'}
          />
        </BaseIcon>
      )
    }
    return (
      <BaseIcon {...props}>
        <Image
          height={props.height || props.size || '32px'}
          name={name.toLowerCase()}
          width={props.width || props.size || '32px'}
        />
      </BaseIcon>
    )
  }

  return <BaseIcon {...rest} code={code} cursorEnabled={cursor} />
}

Icon.propTypes = {
  color: PropTypes.string,
  cursor: PropTypes.bool,
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900])
}

Icon.defaultProps = {
  color: 'grey700',
  cursor: false,
  size: '16px',
  weight: 400
}

export default Icon
