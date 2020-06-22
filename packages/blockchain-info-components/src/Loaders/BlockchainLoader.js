import { Image } from '../..'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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
  width: '150px',
  height: '150px'
}

export default BlockchainLoader
