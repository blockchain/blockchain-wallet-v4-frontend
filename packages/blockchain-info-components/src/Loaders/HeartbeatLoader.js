import React from 'react'
import PropTypes from 'prop-types'
import { keysIn } from 'ramda'
import styled, { css, keyframes } from 'styled-components'

import { Palette } from '../Colors/index.ts'

const bounceFrames = keyframes`
  0%, 100% { transform: scale(0.0); }
  50% { transform: scale(1.0); }
`
const bounceAnimation = css`
  animation: ${bounceFrames} 2s infinite ease-in-out;
`
const Container = styled.div`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
`
const Circle1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  background-color: ${props => props.theme[props.color]};
  ${bounceAnimation};
`
const Circle2 = styled(Circle1)`
  animation-delay: -1s;
`

const HeartbeatLoader = props => {
  const { color, ...rest } = props

  return (
    <Container {...rest}>
      <Circle1 color={color} />
      <Circle2 color={color} />
    </Container>
  )
}

HeartbeatLoader.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.oneOf(keysIn(Palette()))
}

HeartbeatLoader.defaultProps = {
  width: '40px',
  height: '40px',
  color: 'blue600'
}

export default HeartbeatLoader
