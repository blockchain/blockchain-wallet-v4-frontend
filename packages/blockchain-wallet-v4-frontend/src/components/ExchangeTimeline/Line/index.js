import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const animation = keyframes`
  0% { width: 100%; }
  25% { width: 25%; }
  50% { width: 50%; }
  75% { width: 75%; }
  100%: { width: 100%; }
`

const Wrapper = styled.div`
  flex-basis: 20%;
  flex-shrink: 2;
  background-color: white;
`
const Rectangle = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.status === 'disabled' ? props.theme['gray-2'] : props.theme['brand-primary']};
  animation: ${animation} 2s infinite linear;
  animation-play-state: ${props => props.status === 'active' ? 'running' : 'paused'};
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
