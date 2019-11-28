import { Container } from './template.success'
import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'

const Loading = () => {
  return (
    <Container>
      <SkeletonRectangle width='350px' height='300px' />
      <SkeletonRectangle width='350px' height='300px' />
    </Container>
  )
}

export default Loading
