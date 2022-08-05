import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconCheckCircle } from '@blockchain-com/icons'
import { addConnection, TabMetadata } from 'plugin/internal'
import { ConnectionEvents } from 'plugin/provider/types'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import styled, { keyframes } from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

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
  const dispatch = useDispatch()
  const address = useSelector((state: RootState) =>
    selectors.components.plugin.getPublicAddress(state)
  )

  useEffect(() => {
    dispatch(actions.components.plugin.getPublicAddress())
  }, [dispatch])

  useEffect(() => {
    if (!address) return

    const timeout = setTimeout(async () => {
      try {
        await addConnection(metadata.origin)
        await chrome.runtime.sendMessage({
          data: [address],
          type: SupportedRPCMethods.RequestAccounts
        })
        window.close()
      } catch (e) {
        await chrome.runtime.sendMessage({
          data: e.message,
          type: ConnectionEvents.Error
        })
      }
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [metadata.origin, address])

  return <ConnectedIcon width='137px' height='137px' />
}
