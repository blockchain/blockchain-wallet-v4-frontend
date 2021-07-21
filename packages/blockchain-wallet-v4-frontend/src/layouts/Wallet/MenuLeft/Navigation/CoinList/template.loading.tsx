import React from 'react'
import styled from 'styled-components'

import { SkeletonCircle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 8px;
  height: 48px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
`

const Circle = styled(SkeletonCircle)`
  margin-right: 10px;
`

const Loading: React.FC<Props> = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Wrapper key={i}>
          <Circle height='24px' width='24px' bgColor='grey200' />
        </Wrapper>
      ))}
    </>
  )
}

type Props = {}

export default Loading
