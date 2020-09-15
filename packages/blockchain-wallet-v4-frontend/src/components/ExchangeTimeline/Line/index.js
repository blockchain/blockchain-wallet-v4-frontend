import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'

const animationFrames = keyframes`
  0% { width: 100%; }
  25% { width: 25%; }
  50% { width: 50%; }
  75% { width: 75%; }
  100% { width: 100%; }
`
const animation = css`
  animation: ${animationFrames} 2s infinite linear;
`

const Wrapper = styled.div`
  flex-basis: 20%;
  flex-shrink: 2;
  background-color: white;
`
const Rectangle = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props =>
    props.status === 'disabled' ? props.theme.grey200 : props.theme.blue900};
  animation-play-state: ${props =>
    props.status === 'active' ? 'running' : 'paused'};
  ${animation};
`

const Line = props => (
  <Wrapper>
    <Rectangle status={props.status} />
  </Wrapper>
)

Line.propTypes = {
  status: PropTypes.oneOf(['disabled', 'active', 'inactive'])
}

Line.defaultProps = {
  status: 'disabled'
}

export default Line
