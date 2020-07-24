import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DisplayIcon } from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { Icon, Text } from 'blockchain-info-components'
import { SBBalancesType, SBPaymentMethodType, WalletFiatType } from 'core/types'
import { Title, Value } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Props } from '../template.success'

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
  margin-top: 4px;
`
const DisplayValue = styled(Value)`
  margin-top: 0px;
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
    <DisplayValue>{renderCardText(value)}</DisplayValue>
    <DisplayTitle>
      <FormattedMessage
        id='modals.simplebuy.card_limit'
        defaultMessage='{card} Limit'
        values={{
          card: `${fiatToString({
            value: convertBaseToStandard('FIAT', value.limits.max),
            unit: String(value.currency) as WalletFiatType
          })} ${value.currency}`
        }}
      />
    </DisplayTitle>
  </>
)

const renderFund = (value: SBPaymentMethodType, sbBalances: SBBalancesType) => (
  <>
    <DisplayValue>{value.currency}</DisplayValue>
    <DisplayTitle>
      {fiatToString({
        value: convertBaseToStandard(
          'FIAT',
          sbBalances[value.currency as WalletFiatType]?.available
        ),
        unit: String(value.currency) as WalletFiatType
      })}{' '}
      <FormattedMessage id='copy.available' defaultMessage='Available' />
    </DisplayTitle>
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
          name={value.currency.toLowerCase() as keyof IcoMoonType}
        />
      )
    default:
      return <></>
  }
}

const Payment: React.FC<Props> = props => (
  <PaymentContainer
    role='button'
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
            : renderFund(props.method, props.sbBalances)}
        </PaymentText>
      </>
    )}
    <PaymentArrowContainer>
      <Icon cursor name='arrow-right' size='20px' color='grey600' />
    </PaymentArrowContainer>
  </PaymentContainer>
)

export default Payment
