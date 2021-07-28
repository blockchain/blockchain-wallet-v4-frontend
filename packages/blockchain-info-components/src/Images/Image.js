import React from 'react'
import PropTypes from 'prop-types'
import { keysIn } from 'ramda'
import styled from 'styled-components'

import Images from './Images'

export const BaseImage = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.color};
`

const Image = (props) => {
  const { name, srcset, ...rest } = props
  const file = Images[name]
  const srcSet = srcset ? keysIn(srcset).map((name) => `${Images[name]} ${srcset[name]}`) : []
  if (!file) {
    return <img alt='empty-img' />
  }
  return <BaseImage src={file} srcSet={srcSet.join(', ')} {...rest} />
}

Image.defaultProps = {
  color: 'auto',
  height: 'auto',
  width: 'auto'
}

Image.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  name: PropTypes.string.isRequired,
  width: PropTypes.string
}

export default Image
