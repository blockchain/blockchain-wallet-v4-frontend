import React from 'react'
import { Icon } from 'blockchain-info-components'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const RotateSync = props => {
  const RotateIcon = styled(Icon)`
    animation: ${rotate} 2.5s linear infinite;
  `

  return <RotateIcon name='sync-regular' {...props} />
}
