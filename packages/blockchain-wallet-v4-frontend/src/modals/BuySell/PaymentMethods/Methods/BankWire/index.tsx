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
      <DisplaySubTitle>
        <FormattedMessage
          id='copy.number_of_business_days'
          defaultMessage='{first} to {second} Business Days'
          values={{ first: '3', second: '5' }}
        />
      </DisplaySubTitle>
      <Description>
        {value.currency === 'USD' ? (
          <FormattedMessage
            id='modals.simplebuy.bankwire.description_v2'
            defaultMessage='Send funds directly from your bank to your Blockchain.com Wallet. Once we receive the wire transfer, we’ll complete your purchase.'
          />
        ) : (
          <FormattedMessage
            id='modals.simplebuy.banktransfer.description'
            defaultMessage='Send funds directly from your bank to your Blockchain.com Wallet. Once we receive the bank transfer, we’ll complete your purchase.'
          />
        )}
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default BankWire
