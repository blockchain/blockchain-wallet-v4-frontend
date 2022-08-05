import React, { useEffect } from 'react'
import { IconBlockchainCircle } from '@blockchain-com/icons'
import { TabMetadata } from 'plugin/internal'
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
const SiteIconContainer = styled('div')`
  z-index: 1;
  animation: ${siteIconFrames} 2s ease-in both;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: auto;
`
const SiteIcon = styled('img')`
  width: 100%;
`
const ConnectingWrapper = styled(Flex)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`
export const Connecting: React.FC<{
  metadata: TabMetadata
  setConnectStep: React.Dispatch<React.SetStateAction<ConnectStep>>
}> = ({ metadata, setConnectStep }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnectStep(ConnectStep.Connected)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [setConnectStep])

  return (
    <ConnectingWrapper>
      <BlockchainIcon width='120px' height='120px' />
      {metadata.favicon !== '' ? (
        <SiteIconContainer>
          <SiteIcon src={metadata.favicon} alt='icon' />
        </SiteIconContainer>
      ) : (
        <BlockchainIcon width='120px' height='120px' />
      )}
    </ConnectingWrapper>
  )
}
