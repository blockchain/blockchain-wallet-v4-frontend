import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { MobilePaymentType } from '@core/types'
import { Box, Icon, Image } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/BuySell'
import {
  DisplayValue,
  getIcon,
  getText,
  PaymentArrowContainer,
  PaymentText,
  SectionTitle
} from 'components/Flyout/model'
import { Analytics } from 'data/analytics/types'

import { Props } from '../template.success'
import { DisplayIcon, DisplayIconAligned } from './Payment.styles'

const RightArrowIcon = styled(Icon)<{
  disabled?: boolean
}>`
  transform: rotate(180deg);
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

const Payment: React.FC<Props> = (props: Props) => {
  const nextStep = props.hasPaymentAccount ? 'LINKED_PAYMENT_ACCOUNTS' : 'PAYMENT_METHODS'

  const { preferredFiatTradingCurrency } = props.userData.currencies

  // ensure only non SDD flow and non empty amount field open the payment selection screen
  const onPaymentMethodClick = () => {
    props.analyticsActions.trackEvent({
      key: Analytics.BUY_CHANGE_PAYMENT_METHOD_CLICKED,
      properties: {}
    })

    props.buySellActions.setStep({
      cryptoCurrency: props.cryptoCurrency,
      fiatCurrency: props.fiatCurrency || preferredFiatTradingCurrency,
      pair: props.pair,
      step: nextStep
    })
  }

  const isApplePay = props.mobilePaymentMethod === MobilePaymentType.APPLE_PAY

  const isGooglePay = props.mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY

  const renderIcon = () => {
    if (isApplePay) {
      return <Image name='apple-pay' height='18px' />
    }

    if (isGooglePay) {
      return <Image name='google-pay' height='18px' />
    }

    return getIcon(props.method)
  }

  const renderText = () => {
    if (isApplePay) {
      return (
        <DisplayValue>
          <FormattedMessage id='modals.simplebuy.applepay' defaultMessage='Apple Pay' />
        </DisplayValue>
      )
    }

    if (isGooglePay) {
      return (
        <DisplayValue>
          <FormattedMessage id='modals.simplebuy.googlepay' defaultMessage='Google Pay' />
        </DisplayValue>
      )
    }

    return getText(props.method, props.sbBalances)
  }

  return (
    <>
      <SectionTitle color='grey900' size='14px' weight={500}>
        {props.orderType === 'SELL' && (
          <FormattedMessage
            id='modals.simplebuy.checkout.receive'
            defaultMessage='Recipient Account'
          />
        )}
      </SectionTitle>
      <Box
        role='button'
        data-e2e='paymentMethodSelect'
        onClick={onPaymentMethodClick}
        style={{ alignItems: 'flex-start' }}
      >
        <DisplayIcon>
          <DisplayPaymentIcon showBackground={!props.method}>{renderIcon()}</DisplayPaymentIcon>
        </DisplayIcon>

        <PaymentText style={{ minWidth: 0 }} isMethod={!!props.method}>
          {renderText()}
        </PaymentText>

        <DisplayIconAligned>
          <PaymentArrowContainer>
            <RightArrowIcon cursor name='arrow-back' size='20px' color='grey600' />
          </PaymentArrowContainer>
        </DisplayIconAligned>
      </Box>
    </>
  )
}

export default Payment
