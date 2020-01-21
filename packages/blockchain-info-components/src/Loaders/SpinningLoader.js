import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'

const spinFrames = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`
const spinAnimation = css`
  animation: ${spinFrames} 1.25s infinite linear;
`
const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
  border: 8px solid ${props => props.theme.blue200};
  border-radius: 50%;
  overflow: hidden;
  border-top-color: ${props => props.theme.blue600};
  ${spinAnimation};
`

const SpinningLoader = props => <Wrapper {...props} />

SpinningLoader.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
}

SpinningLoader.defaultProps = {
  width: '75px',
  height: '75px'
}

export default SpinningLoader
