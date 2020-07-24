import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { DisplayIcon } from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { Icon, Text } from 'blockchain-info-components'
import { Props } from '..'
import { Title } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

type PaymentContainerProps = {
  isMethod: boolean
}

const PaymentContainer = styled.div<PaymentContainerProps>`
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  width: 400px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: ${props => (props.isMethod ? `12px 28px` : `23px 28px 28px 28px`)};
  justify-content: space-between;
  ${props => !props.isMethod && `line-height: 32px;`}
`

const SelectIconWrapper = styled.div`
  background-color: ${props => props.theme.blue000};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 22px;
`
const SelectPaymentText = styled(Text)`
  width: 285px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
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
          name={value.currency.toLowerCase() as keyof IcoMoonType}
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
    isMethod={!!props.method}
  >
    {props.method && (
      <>
        <DisplayPaymentIcon>{getIcon(props.method)}</DisplayPaymentIcon>
        <PaymentText>
          {props.method.type === 'USER_CARD'
            ? renderCard(props.method)
            : renderFund(props.method)}
        </PaymentText>
        <PaymentArrowContainer>
          <Icon cursor name='arrow-right' size='20px' color='grey600' />
        </PaymentArrowContainer>
      </>
    )}

    {!props.method && (
      <>
        <SelectIconWrapper>
          <Icon
            cursor
            name='plus-in-circle-filled'
            size='22px'
            color='blue600'
            style={{ marginLeft: '4px' }}
          />
        </SelectIconWrapper>
        <SelectPaymentText>
          <FormattedMessage
            id='modals.simplebuy.confirm.jump_to_payment'
            defaultMessage='Select Cash or Card'
          />
        </SelectPaymentText>
        <Icon cursor name='arrow-right' size='20px' color='grey600' />
      </>
    )}
  </PaymentContainer>
)

export default Payment
