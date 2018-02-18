import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: ${props => parseFloat(props.width) / 2 + 'px'};
  background-color: ${props => props.theme[props.bgColor]};
`

const SkeletonRectangle = props => (
  <Wrapper {...props}>
  </Wrapper>
)

SkeletonRectangle.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired
}

export default SkeletonRectangle
