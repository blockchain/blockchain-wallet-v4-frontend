import React, { useEffect } from 'react'
import { IconCheckCircle } from '@blockchain-com/icons'
import { addConnection, TabMetadata } from 'plugin/internal'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import styled, { keyframes } from 'styled-components'

const showingFrames = keyframes`
  from { opacity: 0; transform: scale(0.1) }
  to { opacity: 1; transform: scale(1)}
`

const ConnectedIcon = styled(IconCheckCircle)`
  animation: ${showingFrames} 2s ease-in-out;
  color: ${(props) => props.theme.white};
`
export const Connected: React.FC<{
  metadata: TabMetadata
}> = ({ metadata }) => {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        await addConnection(metadata.origin)
        await chrome.runtime.sendMessage({
          data: 'random address',
          type: SupportedRPCMethods.RequestAccounts
        })
        window.close()
      } catch (e) {
        // eslint-disable-next-line
        console.log(e)
      }
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return <ConnectedIcon width='137px' height='137px' />
}
