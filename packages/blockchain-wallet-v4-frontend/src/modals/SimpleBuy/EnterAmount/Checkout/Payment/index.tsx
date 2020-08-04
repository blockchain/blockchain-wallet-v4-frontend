import {
  DisplayPaymentIcon,
  getIcon,
  getText,
  PaymentArrowContainer,
  PaymentContainer,
  PaymentText
} from './model'
import { Icon } from 'blockchain-info-components'
import { Props } from '../template.success'
import React from 'react'

const Payment: React.FC<Props & {
  handleAmountErrorClick: () => void
}> = props => (
  <PaymentContainer
    role='button'
    data-e2e='paymentMethodSelect'
    onClick={() => {
      props.formErrors && props.formErrors.amount
        ? props.handleAmountErrorClick()
        : props.simpleBuyActions.setStep({
            step: 'PAYMENT_METHODS',
            pair: props.pair,
            fiatCurrency: props.fiatCurrency || 'USD',
            cryptoCurrency: props.cryptoCurrency
          })
    }}
    isMethod={!!props.method}
  >
    <DisplayPaymentIcon isMethod={!!props.method}>
      {getIcon(props.method)}
    </DisplayPaymentIcon>
    <PaymentText isMethod={!!props.method}>
      {getText(props.method, props.sbBalances)}
    </PaymentText>
    <PaymentArrowContainer>
      <Icon cursor name='arrow-right' size='20px' color='grey600' />
    </PaymentArrowContainer>
  </PaymentContainer>
)

export default Payment
