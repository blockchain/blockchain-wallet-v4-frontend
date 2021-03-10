import React from 'react'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Container } from 'components/Box'

const Loading = () => {
  return (
    <Container>
      <SkeletonRectangle width='330px' height='270px' />
      <SkeletonRectangle width='330px' height='270px' />
    </Container>
  )
}

export default Loading
