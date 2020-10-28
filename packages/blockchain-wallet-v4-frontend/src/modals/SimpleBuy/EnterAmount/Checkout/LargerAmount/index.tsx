import {
  AmountText,
  IconContainer,
  InfoText,
  LargeAmountContainer
} from './model'
import { currencySymbolMap } from 'services/CoinifyService'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { Props } from '../template.success'
import React from 'react'

const LargerAmount: React.FC<Props> = props => (
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

export default LargerAmount
