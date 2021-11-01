import React from 'react'
import PropTypes from 'prop-types'
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
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border: ${(props) => props.borderWidth} solid ${(props) => props.theme.blue200};
  border-radius: 50%;
  overflow: hidden;
  border-top-color: ${(props) => props.theme.blue600};
  ${spinAnimation};
`

const SpinningLoader = (props) => <Wrapper {...props} />

SpinningLoader.propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

SpinningLoader.defaultProps = {
  borderWidth: '8px',
  height: '75px',
  width: '75px'
}

export default SpinningLoader
