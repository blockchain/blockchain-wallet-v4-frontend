import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { TabMetadata } from 'plugin/internal'
import { ConnectionEvents } from 'plugin/provider/types'
import { SupportedRPCMethods } from 'plugin/provider/utils'
import { CombinedState } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { actions, selectors } from 'data'

const TITLE = 'Your signature is being requested by Uniswap'
const ADDRESS = 'Oxf56aab5cE63eF6ABC39f2F6A0586999716d465'

const Wrapper = styled(Flex)`
  height: 100%;
`

const CenteredText = styled(Text)`
  text-align: center;
`

const TextWithBreak = styled(Text)`
  word-break: break-all;
`

const SignatureRequest = (props) => {
  const dispatch = useDispatch()
  const [metadata, setMetedata] = useState<TabMetadata>({ origin: '' })
  const [message, setMessage] = useState<string>('')
  const signer = useSelector((state: CombinedState<any>) =>
    selectors.components.plugin.getWallet(state)
  )

  const deny = () => {
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.SignMessage
      })
    }
    window.close()
  }

  const confirm = async () => {
    try {
      const signedMessage = await signer?.signMessage(message)
      await chrome.runtime.sendMessage({
        data: signedMessage,
        type: SupportedRPCMethods.SignMessage
      })
    } catch (e) {
      await chrome.runtime.sendMessage({
        data: e.message,
        type: ConnectionEvents.Error
      })
    }
    window.close()
  }

  useEffect(() => {
    const params = new URLSearchParams(props.history.location.search)
    setMetedata({
      favicon: params.get('favicon') || '',
      origin: params.get('domain') || ''
    })
    setMessage(params.get('message') || '')
  }, [props.history.location.search])

  useEffect(() => {
    dispatch(actions.components.plugin.getWallet())
    window.onbeforeunload = () => {
      chrome.runtime.sendMessage({
        data: null,
        type: SupportedRPCMethods.SignMessage
      })
    }
  }, [])

  return (
    <Wrapper flexDirection='column' justifyContent='space-between'>
      <div>
        <Padding bottom={49}>
          <Flex justifyContent='center' flexDirection='column' alignItems='center'>
            <Padding bottom={6}>
              <CenteredText size='20px' lineHeight='30px' color='white' weight={700}>
                <FormattedMessage id='plugin.signatureRequest.title' defaultMessage={TITLE} />
              </CenteredText>
            </Padding>

            <Text size='14px' lineHeight='21px' color='grey400' weight={500}>
              {metadata.origin}
            </Text>
          </Flex>
        </Padding>
        <Padding bottom={5}>
          <Text size='12px' lineHeight='18px' color='grey400' weight={500}>
            <FormattedMessage id='plugin.signatureRequest.message' defaultMessage='Message' />
          </Text>
        </Padding>

        <TextWithBreak size='14px' lineHeight='21px' color='white' weight={500}>
          {message}
        </TextWithBreak>
      </div>

      <Padding top={33}>
        <Flex justifyContent='space-between'>
          <Button height='48px' data-e2e='signature-request-deny' onClick={deny}>
            <FormattedMessage id='plugin.signatureRequest.cancel' defaultMessage='Cancel' />
          </Button>

          <Button height='48px' data-e2e='signature-request-confirm' onClick={confirm}>
            <FormattedMessage id='plugin.signatureRequest.confirm' defaultMessage='Confirm' />
          </Button>
        </Flex>
      </Padding>
    </Wrapper>
  )
}

export default SignatureRequest
