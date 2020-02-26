import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = {}

const CustomSkeletonRectangle = styled(SkeletonRectangle)`
  margin-bottom: 23px;
`

const Loading: React.FC<Props> = () => {
  return <CustomSkeletonRectangle width='40%' height='30px' bgColor='gray-1' />
}

export default Loading
