import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Images from './Images'

const BaseImage = styled.img`
  width: ${props => props.width};
  height: ${props => props.height};
  color: ${props => props.color};
`

const Image = (props) => {
  const { name, ...rest } = props
  const file = Images[name]
  if (!file) { return <img /> }

  return <BaseImage src={file} {...rest} />
}

Image.defaultProps = {
  width: 'auto',
  height: 'auto',
  color: 'auto'
}

Image.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string
}

export default Image
