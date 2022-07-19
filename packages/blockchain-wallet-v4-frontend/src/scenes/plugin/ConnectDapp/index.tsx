import React, { useEffect, useState } from 'react'
import { IconBlockchain } from '@blockchain-com/icons'
import styled, { keyframes } from 'styled-components'

import { Flex } from 'components/Flex'

import { Confirmation } from './Confirmation'
import { Connected } from './Connected'
import { Connecting } from './Connecting'

const ConnectWrapper = styled(Flex)`
  height: 100%;
  justify-content: center;
  align-items: center;
`
const showingFrames = keyframes`
  from { opacity: 0; transform: scale(0.1) }
  to { opacity: 1; transform: scale(1)}
`
const BlockchainIcon = styled(IconBlockchain)`
  animation: ${showingFrames} 2s ease-in-out;
  color: ${(props) => props.theme.white};
`

export enum ConnectStep {
  Confirmation = 'Confirmation',
  Connected = 'Connected',
  Connectiing = 'Connectiing',
  InitialScreen = 'InitialScreen'
}

export const ConnectDapp = () => {
  const [connectStep, setConnectStep] = useState<ConnectStep>(ConnectStep.InitialScreen)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnectStep(ConnectStep.Confirmation)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const getConnectStep = () => {
    switch (connectStep) {
      case ConnectStep.Confirmation:
        return <Confirmation setConnectStep={setConnectStep} />
      case ConnectStep.Connectiing:
        return <Connecting setConnectStep={setConnectStep} />
      case ConnectStep.Connected:
        return <Connected setConnectStep={setConnectStep} />
      default:
        return <BlockchainIcon width='137px' height='137px' />
    }
  }
  return <ConnectWrapper>{getConnectStep()}</ConnectWrapper>
}
