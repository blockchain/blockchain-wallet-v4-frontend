import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled, { css } from 'styled-components'

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

const RightArrowIcon = styled(Icon)<{
  disabled?: boolean
}>`
  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

const Payment: React.FC<Props & { invalid?: boolean }> = props => {
  const step =
    props.hasFiatBalance ||
    props.cards.length ||
    props.bankTransferAccounts.length
      ? 'LINKED_PAYMENT_ACCOUNTS'
      : 'PAYMENT_METHODS'

  // disable payment method selection if SDD flow or there is invalid amount entered
  const disablePaymentSelect = props.isSddFlow ? false : props.invalid
  // ensure only non SDD flow and non empty amount field open the payment selection screen
  const onPaymentMethodClick = () => {
    return !disablePaymentSelect && !props.isSddFlow
      ? props.simpleBuyActions.setStep({
          step,
          pair: props.pair,
          fiatCurrency: props.fiatCurrency || 'USD',
          cryptoCurrency: props.cryptoCurrency
        })
      : null
  }

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
        disabled={disablePaymentSelect}
        role='button'
        data-e2e='paymentMethodSelect'
        onClick={onPaymentMethodClick}
        isMethod={!!props.method}
      >
        <DisplayPaymentIcon showBackground={!props.method}>
          {getIcon(props.method, props.isSddFlow, disablePaymentSelect)}
        </DisplayPaymentIcon>
        <PaymentText isMethod={!!props.method}>
          {getText(props.method, props.sbBalances, props.isSddFlow)}
        </PaymentText>
        {!props.isSddFlow && (
          <PaymentArrowContainer>
            <RightArrowIcon
              cursor
              disabled={disablePaymentSelect}
              name='arrow-right'
              size='20px'
              color='grey600'
            />
          </PaymentArrowContainer>
        )}
      </PaymentContainer>
    </>
  )
}

export default Payment
