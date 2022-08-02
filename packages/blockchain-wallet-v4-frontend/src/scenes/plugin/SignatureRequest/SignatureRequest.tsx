import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

const TITLE = 'Your signature is being requested by Uniswap'
const ADDRESS = 'Oxf56aab5cE63eF6ABC39f2F6A0586999716d465'
const MESSAGE =
  'https://uniswap.org/ wants you to sign in with your Ethereum account:\n' +
  'Oxf56aab5cE63eF6ABC39f2F6A0586999716d465'
const URL = 'app.uniswap.org'

const Wrapper = styled(Flex)`
  height: 100%;
`

const CenteredText = styled(Text)`
  text-align: center;
`

const TextWithBreak = styled(Text)`
  word-break: break-all;
`

const SignatureRequest = () => {
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
              {URL}
            </Text>
          </Flex>
        </Padding>

        <Padding bottom={40}>
          <Padding bottom={5}>
            <Text size='12px' lineHeight='18px' color='grey400' weight={500}>
              <FormattedMessage
                id='plugin.signatureRequest.toAccount'
                defaultMessage='To account'
              />
            </Text>
          </Padding>

          <Text size='14px' lineHeight='21px' color='white' weight={500}>
            <CryptoAddress>{ADDRESS}</CryptoAddress>
          </Text>
        </Padding>

        <Padding bottom={5}>
          <Text size='12px' lineHeight='18px' color='grey400' weight={500}>
            <FormattedMessage id='plugin.signatureRequest.message' defaultMessage='Message' />
          </Text>
        </Padding>

        <TextWithBreak size='14px' lineHeight='21px' color='white' weight={500}>
          {MESSAGE}
        </TextWithBreak>
      </div>

      <Padding top={33}>
        <Flex justifyContent='space-between'>
          <Button height='48px' data-e2e='transaction-details-go-back-button'>
            <FormattedMessage id='plugin.signatureRequest.cancel' defaultMessage='Cancel' />
          </Button>

          <Button height='48px' data-e2e='transaction-details-go-back-button'>
            <FormattedMessage id='plugin.signatureRequest.confirm' defaultMessage='Confirm' />
          </Button>
        </Flex>
      </Padding>
    </Wrapper>
  )
}

export default SignatureRequest
