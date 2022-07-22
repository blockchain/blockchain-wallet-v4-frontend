import React, { useEffect } from 'react'
import { IconCheckCircle } from '@blockchain-com/icons'
import styled, { keyframes } from 'styled-components'

import { ConnectStep } from '.'

const showingFrames = keyframes`
  from { opacity: 0; transform: scale(0.1) }
  to { opacity: 1; transform: scale(1)}
`

const ConnectedIcon = styled(IconCheckCircle)`
  animation: ${showingFrames} 2s ease-in-out;
  color: ${(props) => props.theme.white};
`
export const Connected: React.FC<{
  setConnectStep: React.Dispatch<React.SetStateAction<ConnectStep>>
}> = ({ setConnectStep }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnectStep(ConnectStep.InitialScreen)
      window.location.replace('/#/plugin/coinslist')
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return <ConnectedIcon width='137px' height='137px' />
}
