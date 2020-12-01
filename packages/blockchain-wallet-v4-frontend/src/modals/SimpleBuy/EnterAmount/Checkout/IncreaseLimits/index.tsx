import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { currencySymbolMap } from 'services/CoinifyService'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { Icon, Text } from 'blockchain-info-components'

import { Props } from '../template.success'

const LargeAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const AmountText = styled(Text)`
  flex: 1;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 108px;
`
const InfoText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  margin-top: 22px;
`

const IncreaseLimits: React.FC<Props> = props => (
  <LargeAmountContainer>
    <IconContainer>
      <DisplayPaymentIcon showBackground={true}>
        <Icon cursor name='plus' size='22px' color='blue600' />
      </DisplayPaymentIcon>
      <AmountText size='16px' weight={600} color='grey800'>
        <FormattedMessage
          id='modals.simplebuy.checkout.larger_amount.title'
          defaultMessage='Want to buy larger amounts?'
        />
      </AmountText>
    </IconContainer>
    <InfoText color='grey600'>
      <FormattedHTMLMessage
        id='modals.simplebuy.checkout.larger_amount.info1'
        defaultMessage='Getting up to {symbol}{amount} per transaction with card is the <b>fastest way to buy crypto</b>, it only takes a few minutes.'
        values={{
          amount: '150',
          symbol: currencySymbolMap[props.fiatCurrency]
        }}
      />
    </InfoText>
    <InfoText color='grey600'>
      <FormattedMessage
        id='modals.simplebuy.checkout.larger_amount.info1'
        defaultMessage='To buy larger amounts and unlock more payment methods you need to become Gold level and verify your identity.'
      />
    </InfoText>
  </LargeAmountContainer>
)

export default IncreaseLimits
