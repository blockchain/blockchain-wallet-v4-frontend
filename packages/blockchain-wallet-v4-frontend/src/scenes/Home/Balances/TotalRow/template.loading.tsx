import React from 'react'
import { SkeletonRectangle } from 'blockchain-info-components'
import styled from 'styled-components'

type Props = {}

const CustomSkeletonRectangle = styled(SkeletonRectangle)`
  margin-bottom: 23px;
`

const Loading: React.FC<Props> = () => {
  return <CustomSkeletonRectangle width='40%' height='30px' bgColor='grey000' />
}

export default Loading
