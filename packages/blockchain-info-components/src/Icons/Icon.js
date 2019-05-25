import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icomoon from './Icomoon'

const BaseIcon = styled.span`
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  color: ${props => props.theme[props.color] || props.color};
  -webkit-font-smoothing: antialiased;
  cursor: ${props => (props.cursorEnabled ? 'pointer' : 'inherit')};
  display: flex;

  &:before {
    font-family: 'icomoon', sans-serif;
    content: '${props => props.code}';
  }
`

// ❗️PAX is a multicolor Icon and has multiple paths
const BaseIconPax = styled.span`
  display: flex;
  font-size: ${props => props.size};
  font-weight: ${props => props.weight};
  color: ${props => props.theme[props.color]};
  &:before {
    content: '';
  }
  .path {
    font-family: 'icomoon', sans-serif;
    font-weight: inherit;
    font-size: inherit;
    color: inherit;
  }
  .path1:before {
    content: '\\e914';
    opacity: 0.4;
  }
  .path2:before {
    content: '\\e91d';
    margin-left: -1em;
    opacity: 0.6;
  }
  .path3:before {
    content: '\\e921';
    margin-left: -1em;
    opacity: 0.4;
  }
  .path4:before {
    content: '\\e927';
    margin-left: -1em;
    opacity: 0.8;
  }
  .path5:before {
    content: '\\e928';
    margin-left: -1em;
  }
`

const Icon = props => {
  const { name, cursor, ...rest } = props
  const code = Icomoon[name]

  // ❗️PAX is a multicolor Icon and has multiple paths
  if (name === 'pax') {
    return (
      <BaseIconPax {...rest} code={code} cursorEnabled={cursor}>
        <span className='path path1' />
        <span className='path path2' />
        <span className='path path3' />
        <span className='path path4' />
        <span className='path path5' />
      </BaseIconPax>
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
  color: 'gray-5',
  cursor: false
}

export default Icon
