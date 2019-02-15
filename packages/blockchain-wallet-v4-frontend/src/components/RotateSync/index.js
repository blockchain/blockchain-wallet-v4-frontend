import React from 'react'
import { Icon } from 'blockchain-info-components'
import styled, { css, keyframes } from 'styled-components'

const rotateFrames = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const rotateAnimation = css`
  ${rotateFrames} 2.5s linear infinite;
`

export const RotateSync = props => {
  const RotateIcon = styled(Icon)`
    animation: ${rotateAnimation};
  `

  return <RotateIcon name='sync-regular' {...props} />
}
