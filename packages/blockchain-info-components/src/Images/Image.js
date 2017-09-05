import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Images from './Images'

const BaseImage = styled.img`
  width: ${props => props.width};
  height: ${props => props.height};
`
const removeSlashes = (path) => path.replace(/^\/|\/$/g, '')

const Image = (props) => {
  const { name, ...rest } = props
  const file = Images[name]

  return <BaseImage src={`/${removeSlashes(file)}`} {...rest} />
}

Image.defaultProps = {
  width: 'auto',
  height: 'auto'
}

Image.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string
}

export default Image
