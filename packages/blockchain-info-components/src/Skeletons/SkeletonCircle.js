import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Teaser from './Teaser'

const Wrapper = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`

const SkeletonCircle = (props) => {
  const ref = useRef()
  const [width, setWidth] = useState(null)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setWidth(rect.width)
    }
  }, [width, setWidth])

  return (
    <Wrapper>
      <Teaser {...props} borderRadius='50%' />
    </Wrapper>
  )
}

SkeletonCircle.propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

export default SkeletonCircle
