import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { keysIn } from 'ramda'

import { Palette } from '../Colors'

const stretchFrames = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }  
  20% { transform: scaleY(1.0); }
`
const stretchAnimation = css`
  ${stretchFrames} 1.2s infinite ease-in-out;
`
const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: ${props => props.width};
  height: ${props => props.height};
  text-align: center;
  font-size: 10px;
`
const Rectangle = styled.div`
  display: inline-block;
  width: 15%;
  height: 100%;
  background-color: ${props => props.theme[props.color]};
  animation: ${stretchAnimation};
`
const Rectangle1 = styled(Rectangle)`
  animation-delay: -1.1s;
`
const Rectangle2 = styled(Rectangle)`
  animation-delay: -1s;
`
const Rectangle3 = styled(Rectangle)`
  animation-delay: -0.9s;
`
const Rectangle4 = styled(Rectangle)`
  animation-delay: -0.8s;
`
const Rectangle5 = styled(Rectangle)`
  animation-delay: -0.7s;
`

const FlatLoader2 = props => {
  const { color, ...rest } = props

  return (
    <Container {...rest}>
      <Rectangle1 color={color} />
      <Rectangle2 color={color} />
      <Rectangle3 color={color} />
      <Rectangle4 color={color} />
      <Rectangle5 color={color} />
    </Container>
  )
}

FlatLoader2.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  color: PropTypes.oneOf(keysIn(Palette()))
}

FlatLoader2.defaultProps = {
  width: '45px',
  height: '50px',
  color: 'brand-secondary'
}

export default FlatLoader2
