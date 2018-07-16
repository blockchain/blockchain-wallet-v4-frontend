import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Images from './Images'

const BaseBackground = styled.div`
  background: url(${props => props.url});
  background-size: cover;
  background-position: 70% 100%;
  width: ${props => props.width};
  height: ${props => props.height};
`

const Background = props => {
  const { name, ...rest } = props
  const file = Images[name]

  return <BaseBackground url={file} {...rest} />
}

Background.defaultProps = {
  width: 'auto',
  height: 'auto'
}

Background.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string
}

export default Background
