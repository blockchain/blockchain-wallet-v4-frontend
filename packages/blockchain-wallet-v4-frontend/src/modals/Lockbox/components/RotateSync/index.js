import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { Icon } from 'blockchain-info-components'

const rotateFrames = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const rotateAnimation = css`
  animation: ${rotateFrames} 2.5s linear infinite;
`

export const RotateSync = props => {
  const RotateIcon = styled(Icon)`
    ${rotateAnimation};
  `

  return <RotateIcon name='sync-regular' {...props} />
}
