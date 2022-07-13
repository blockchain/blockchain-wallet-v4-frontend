import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'

import { getSubTitleByCurrency } from './utils'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconBank = styled(DisplayIcon)`
  min-height: 75px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: ReactElement | string
  value: BSPaymentMethodType
}

const BankWire: React.FC<Props> = ({ icon, onClick, text, value }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}BankWire`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconBank>{icon}</DisplayIconBank>
    <Content>
      <DisplayTitleBank>{text}</DisplayTitleBank>
      <DisplaySubTitle>{getSubTitleByCurrency(value.currency)}</DisplaySubTitle>
      <Description>
        {value.currency === 'EUR' ? (
          <FormattedMessage
            id='modals.simplebuy.bankwire.eur_description'
            defaultMessage=' Bank fees may apply.'
          />
        ) : value.currency === 'GBP' ? (
          <FormattedMessage
            id='modals.simplebuy.bankwire.gbp_description'
            defaultMessage='Transfers are made through the UK Faster Payments System and usually arrive in seconds.'
          />
        ) : value.currency === 'USD' ? (
          <FormattedMessage
            id='modals.simplebuy.bankwire.description_v'
            defaultMessage='For transferring large amounts. Bank fees may apply.'
          />
        ) : value.currency === 'ARS' ? (
          <FormattedMessage
            id='modals.simplebuy.banktransfer.description_ars'
            defaultMessage='Transfer funds from your bank account to your Blockchain.com Wallet with a bank transfer. Your bank may charge additional fees.'
          />
        ) : (
          <FormattedMessage
            id='modals.simplebuy.banktransfer.description'
            defaultMessage='Send funds directly from your bank to your Blockchain.com Account. Once we receive the bank transfer, we’ll complete your purchase.'
          />
        )}
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default BankWire
