import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { LoginSteps, ProductAuthOptions } from 'data/types'

import { Props } from '../../index'
import { LoginWrapper } from '../../model'

const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  border-top: ${(props) => `1px solid ${props.theme.grey100}`};
  &:first-child {
    border-top: 0;
  }
`

// TODO add media tag for
// min width
const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0 24px 24px;
  min-width: 312px;
`

const ProductPicker = (props: Props) => {
  const handleWalletClick = () => {
    props.authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET })
    props.formActions.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID)
  }
  const handleExchangeClick = () => {
    props.authActions.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE })
    props.formActions.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID)
  }
  return (
    <LoginWrapper>
      <IconTextRow onClick={handleWalletClick}>
        <Image name='wallet-logo' height='48px' width='48px' />
        <TextStack style={{ marginTop: 0 }}>
          <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
          </Text>
          <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.productpicker.wallet'
              defaultMessage='Easily buy and sell Bitcoin, Ether and more.'
            />
          </Text>
        </TextStack>
        <Icon name='chevron-right' size='32px' color='grey400' />
      </IconTextRow>
      <IconTextRow onClick={handleExchangeClick}>
        <Image name='exchange-logo' height='48px' width='48px' />
        <TextStack>
          <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
          </Text>
          <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.productpicker.exchange'
              defaultMessage='Advanced trading with USD, GBP & EUR pairs.'
            />
          </Text>
        </TextStack>
        <Icon name='chevron-right' size='32px' color='grey400' />
      </IconTextRow>
      <Link href='https://blockchain.com/explorer' rel='noopener noreferrer'>
        <IconTextRow>
          <Image name='explorer-logo' height='48px' width='48px' />
          <TextStack style={{ marginBottom: 0 }}>
            <Text color='grey900' size='24px' weight={600} lineHeight='1.5'>
              <FormattedMessage id='copy.explorer' defaultMessage='Explorer' />
            </Text>
            <Text color='grey600' size='16px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.productpicker.explorer'
                defaultMessage='Data analytics for BTC, ETH and more.'
              />
            </Text>
          </TextStack>
          <Icon name='chevron-right' size='32px' color='grey400' />
        </IconTextRow>
      </Link>
    </LoginWrapper>
  )
}

export default ProductPicker
