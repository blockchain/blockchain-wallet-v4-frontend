import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Image } from '../..'

const Img = styled(Image)`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
  overflow: hidden;
`

const BlockchainLoader = props => <Img {...props} name='logo-loader' />

BlockchainLoader.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
}

BlockchainLoader.defaultProps = {
  width: '100px',
  height: '100px'
}

export default BlockchainLoader
