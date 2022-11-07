import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Teaser from './Teaser'

const Wrapper = styled.div`
  border-radius: 8px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`

const SkeletonRectangle = (props) => {
  const ref = useRef()
  const [width, setWidth] = useState(null)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setWidth(rect.width)
    }
  }, [width, setWidth])

  return (
    <Wrapper ref={ref} {...props}>
      <Teaser {...props} width={`${width}px`} />
    </Wrapper>
  )
}

SkeletonRectangle.propTypes = {
  bgColor: PropTypes.string,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

export default SkeletonRectangle
