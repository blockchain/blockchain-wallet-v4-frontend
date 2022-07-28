import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IconBlockchain } from '@blockchain-com/icons'
import { TabMetadata } from 'plugin/internal'
import { getSessionPayload } from 'plugin/internal/chromeStorage'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import styled, { keyframes } from 'styled-components'

import { Flex } from 'components/Flex'
import { actions } from 'data'

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
  Connecting = 'Connecting',
  InitialScreen = 'InitialScreen'
}

type Props = {
  history: {
    location: {
      search: string
    }
  }
}

export const ConnectDapp: FC<Props> = (props) => {
  const [connectStep, setConnectStep] = useState<ConnectStep>(ConnectStep.InitialScreen)
  const [metadata, setMetadata] = useState<TabMetadata>({ origin: '' })

  const dispatch = useDispatch()

  useEffect(() => {
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.RequestAccounts
      })
    }
    ;(async function () {
      const wrapper = await getSessionPayload()
      dispatch(actions.core.wallet.setWrapper(wrapper))
    })()
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams(props.history.location.search)
    setMetadata({
      favicon: params.get('favicon') || '',
      origin: params.get('domain') || ''
    })

    const timeout = setTimeout(() => {
      setConnectStep(ConnectStep.Confirmation)
    }, 2000)

    return () => {
      clearTimeout(timeout)
    }
  }, [props.history.location.search])

  const getConnectStep = () => {
    switch (connectStep) {
      case ConnectStep.Confirmation:
        return <Confirmation setConnectStep={setConnectStep} metadata={metadata} />
      case ConnectStep.Connecting:
        return <Connecting setConnectStep={setConnectStep} metadata={metadata} />
      case ConnectStep.Connected:
        return <Connected metadata={metadata} />
      default:
        return <BlockchainIcon width='137px' height='137px' />
    }
  }
  return <ConnectWrapper>{getConnectStep()}</ConnectWrapper>
}
