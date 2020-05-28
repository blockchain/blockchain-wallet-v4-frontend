import { Container } from 'components/Box'
import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'

const Loading = () => {
  return (
    <Container>
      <SkeletonRectangle width='330px' height='270px' />
      <SkeletonRectangle width='330px' height='270px' />
    </Container>
  )
}

export default Loading
