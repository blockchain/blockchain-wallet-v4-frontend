import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DisplayIcon } from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props } from '..'
import { Title } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const PaymentContainer = styled.div`
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  width: 400px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 12px 28px;
  justify-content: space-between;
`
const PaymentText = styled(Text)`
  width: 285px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`
const PaymentArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const DisplayTitle = styled(Title)`
  align-items: left;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  line-height: 24px;
  color: ${props => props.theme.textBlack};
  width: 100%;
`
const DisplaySubTitle = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  color: ${props => props.theme.grey600};
  width: 100%;
`

const DisplayPaymentIcon = styled(DisplayIcon)`
  justify-content: center;
`

const renderCardText = (value: SBPaymentMethodType): string => {
  return value.card
    ? value.card.label
      ? value.card.label
      : value.card.type
    : 'Credit or Debit Card'
}

const renderCard = (value: SBPaymentMethodType) => (
  <>
    <DisplayTitle>{renderCardText(value)}</DisplayTitle>
    <DisplaySubTitle>
      <FormattedMessage
        id='modals.simplebuy.card_limit'
        defaultMessage='{card} Limit'
        values={{
          card: `${fiatToString({
            value: convertBaseToStandard('FIAT', value.limits.max),
            unit: String(value.currency) as FiatType
          })} ${value.currency}`
        }}
      />
    </DisplaySubTitle>
  </>
)

const renderFund = (value: SBPaymentMethodType) => (
  <>
    <DisplayTitle>{value.currency}</DisplayTitle>
    <DisplaySubTitle>
      {fiatToString({
        value: convertBaseToStandard('FIAT', value.limits.max),
        unit: String(value.currency) as FiatType
      })}
    </DisplaySubTitle>
  </>
)

const getIcon = (value: SBPaymentMethodType): ReactElement => {
  switch (value.type) {
    case 'USER_CARD':
      let cardType = CARD_TYPES.find(
        card => card.type === (value.card ? value.card.type : '')
      )
      return (
        <img
          height='18px'
          width='auto'
          src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
        />
      )
    case 'FUNDS':
      return (
        <Icon
          size='32px'
          color='fiat'
          name={value.currency.toLowerCase() as 'eur' | 'gbp'}
        />
      )
    default:
      return <></>
  }
}

const Payment: React.FC<Props> = props => (
  <PaymentContainer
    onClick={() =>
      props.simpleBuyActions.setStep({
        step: 'PAYMENT_METHODS',
        pair: props.pair,
        fiatCurrency: props.fiatCurrency || 'USD',
        cryptoCurrency: props.cryptoCurrency
      })
    }
  >
    {props.method && (
      <>
        <DisplayPaymentIcon>{getIcon(props.method)}</DisplayPaymentIcon>
        <PaymentText>
          {props.method.type === 'USER_CARD'
            ? renderCard(props.method)
            : renderFund(props.method)}
        </PaymentText>
      </>
    )}
    <PaymentArrowContainer>
      <Icon cursor name='arrow-right' size='20px' color='grey600' />
    </PaymentArrowContainer>
  </PaymentContainer>
)

export default Payment
