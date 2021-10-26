import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Image } from '..'

const Img = styled(Image)`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  overflow: hidden;
`

const BlockchainLoader = (props) => <Img {...props} name='logo-loader' />

BlockchainLoader.propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

BlockchainLoader.defaultProps = {
  height: '100px',
  width: '100px'
}

export default BlockchainLoader
