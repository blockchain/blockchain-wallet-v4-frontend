import { FormattedMessage } from 'react-intl'
import React from 'react'

import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { Icon } from 'blockchain-info-components'

import {
  getIcon,
  getText,
  PaymentArrowContainer,
  PaymentContainer,
  PaymentText,
  SectionTitle
} from './model'
import { Props } from '../template.success'

const Payment: React.FC<Props> = props => {
  const step =
    props.hasFiatBalance ||
    props.cards.length ||
    props.bankTransferAccounts.length
      ? 'LINKED_PAYMENT_ACCOUNTS'
      : 'PAYMENT_METHODS'

  return (
    <>
      <SectionTitle color='grey900' size='14px' weight={500}>
        {props.orderType === 'BUY' ? (
          <FormattedMessage
            id='modals.simplebuy.checkout.payment_method'
            defaultMessage='Payment Method'
          />
        ) : (
          <FormattedMessage
            id='modals.simplebuy.checkout.receive'
            defaultMessage='Recipient Account'
          />
        )}
      </SectionTitle>
      <PaymentContainer
        role='button'
        data-e2e='paymentMethodSelect'
        onClick={() => {
          return !props.isSddFlow
            ? props.simpleBuyActions.setStep({
                step,
                pair: props.pair,
                fiatCurrency: props.fiatCurrency || 'USD',
                cryptoCurrency: props.cryptoCurrency
              })
            : null
        }}
        isMethod={!!props.method}
      >
        <DisplayPaymentIcon showBackground={!props.method}>
          {getIcon(props.method, props.isSddFlow)}
        </DisplayPaymentIcon>
        <PaymentText isMethod={!!props.method}>
          {getText(props.method, props.sbBalances, props.isSddFlow)}
        </PaymentText>
        {!props.isSddFlow && (
          <PaymentArrowContainer>
            <Icon cursor name='arrow-right' size='20px' color='grey600' />
          </PaymentArrowContainer>
        )}
      </PaymentContainer>
    </>
  )
}

export default Payment
