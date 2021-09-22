import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'

import { Props } from '..'
import { CenteredColumn } from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  &:after {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.grey100};
    content: '';
  }
`

const Test = (props: Props) => {
  return (
    <>
      <IconTextRow>
        <Image name='wallet-logo' height='48px' width='48px' />
        <div>
          <Row>
            <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
              <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
            </Text>
            <Icon name='chevron-right' size='32px' color='grey400' />
          </Row>
          <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.productpicker.wallet'
              defaultMessage='Easily buy and sell Bitcoin, Ether and more.'
            />
          </Text>
        </div>
      </IconTextRow>
      <IconTextRow>
        <Image name='exchange-logo' height='48px' width='48px' />
        <TextStack>
          <Row>
            <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
              <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
            </Text>
            <Icon name='chevron-right' size='32px' color='grey400' />
          </Row>
          <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.productpicker.exchange'
              defaultMessage='Advanced trading with USD, GBP & EUR pairs.'
            />
          </Text>
        </TextStack>
      </IconTextRow>
      <IconTextRow>
        <Image name='explorer-logo' height='48px' width='48px' />
        <TextStack>
          <Row>
            <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
              <FormattedMessage id='copy.explorer' defaultMessage='Explorer' />
            </Text>
            <Icon name='chevron-right' size='32px' color='grey400' />
          </Row>
          <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.productpicker.explorer'
              defaultMessage='Data analytics for BTC, ETH and more.'
            />
          </Text>
        </TextStack>
      </IconTextRow>
    </>
  )
}

export default Test
