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
  * {
    color: red !important;
  }

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
  &:before {
    content: '';
  }
  .path {
    font-family: 'icomoon', sans-serif;
    font-weight: inherit;
    font-size: inherit;
  }
  .path1:before {
    content: '\\e929';
    color: #a2d900;
  }
  .path2:before {
    content: '\\e92a';
    color: #3d9ccc;
    margin-left: -1em;
  }
  .path3:before {
    content: '\\e92b';
    color: #ffd919;
    margin-left: -1em;
  }
  .path4:before {
    content: '\\e92c';
    color: #62b247;
    margin-left: -1em;
  }
  .path5:before {
    content: '\\e92d';
    color: #009367;
    margin-left: -1em;
  }
  .path6:before {
    content: '\\e92e';
    color: #00522c;
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
        <span className='path path6' />
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
