import React, { useEffect } from 'react'
import { IconBlockchainCircle } from '@blockchain-com/icons'
import styled, { keyframes } from 'styled-components'

import { Flex } from 'components/Flex'

import { ConnectStep } from '.'

const blockchainIconFrames = keyframes`
  0% { opacity: 0; transform: scale(0.1) }
  50% { opacity: 1; transform: scale(1)}
  90% { opacity: 1; transform: scale(1) translateX(96px)}
  100% { opacity: 0; transform: scale(1) translateX(96px)}
`
const siteIconFrames = keyframes`
  0% { opacity: 0; transform: scale(0.1) }
  50% { opacity: 1; transform: scale(1)}
  90% { opacity: 1; transform: scale(1) translateX(-96px)}
  100% { opacity: 0; transform: scale(1) translateX(-96px)}
`
const BlockchainIcon = styled(IconBlockchainCircle)`
  color: ${(props) => props.theme.white};
  z-index: 2;
  animation: ${blockchainIconFrames} 2s ease-in both;
`
const SiteIcon = styled(IconBlockchainCircle)`
  color: ${(props) => props.theme.white};
  animation: ${siteIconFrames} 2s ease-in both;
`
const ConnectingWrapper = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`
export const Connecting: React.FC<{
  setConnectStep: React.Dispatch<React.SetStateAction<ConnectStep>>
}> = ({ setConnectStep }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnectStep(ConnectStep.Connected)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return (
    <ConnectingWrapper>
      <BlockchainIcon width='120px' height='120px' />
      <SiteIcon width='120px' height='120px' />
    </ConnectingWrapper>
  )
}
