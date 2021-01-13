import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled, { css } from 'styled-components'

import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBBalancesType, SBPaymentMethodType } from 'core/types'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { Icon, Image, Text } from 'blockchain-info-components'
import { Title, Value } from 'components/Flyout'

import { getBankLogoImageName } from '../../../model'

type PaymentContainerProps = {
  isMethod: boolean
}

export const PaymentContainer = styled.div<PaymentContainerProps>`
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: ${props => (props.isMethod ? `12px 28px` : `23px 28px`)};
  justify-content: space-between;
  ${props => !props.isMethod && `line-height: 32px;`}
`

export const PaymentText = styled(Text)<PaymentContainerProps>`
  flex: 1;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  ${props =>
    !props.isMethod &&
    css`
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 35px;
    `}
`
export const PaymentArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const DisplayTitle = styled(Title)`
  margin-top: 4px;
  text-transform: capitalize;
  color: ${p => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`
export const SectionTitle = styled(Text)`
  margin-top: 4px;
  padding: 5px 0;
`
export const DisplayValue = styled(Value)`
  margin-top: 0;
`

// TODO: this code is also in EnterAmount/Checkout/Payment file, dedupe it.
export const renderBankText = (value: SBPaymentMethodType): string => {
  return value.details
    ? value.details.bankName
      ? value.details.bankName
      : value.details.accountNumber
    : 'Bank Account'
}

export const renderBank = (value: SBPaymentMethodType) => (
  <>
    <DisplayValue>{renderBankText(value)}</DisplayValue>
    <DisplayTitle>
      {`${value.details?.bankAccountType.toLowerCase()} account ${
        value.details?.accountNumber
      }`}
    </DisplayTitle>
  </>
)

export const renderCardText = (value: SBPaymentMethodType): string => {
  return value.card
    ? value.card.label
      ? value.card.label
      : value.card.type
    : 'Credit or Debit Card'
}

export const renderCard = (value: SBPaymentMethodType) => (
  <>
    <DisplayValue>{renderCardText(value)}</DisplayValue>
    <DisplayTitle>
      <FormattedMessage
        id='modals.simplebuy.card_limit'
        defaultMessage='{card} Limit'
        values={{
          card: `${fiatToString({
            value: convertBaseToStandard('FIAT', value.limits.max),
            unit: value.currency as FiatType
          })} ${value.currency}`
        }}
      />
    </DisplayTitle>
  </>
)

export const renderFund = (
  value: SBPaymentMethodType,
  sbBalances: SBBalancesType
) => (
  <>
    <DisplayValue>{value.currency}</DisplayValue>
    <DisplayTitle>
      {fiatToString({
        value: convertBaseToStandard(
          'FIAT',
          sbBalances[value.currency]?.available || '0'
        ),
        unit: value.currency as FiatType
      })}{' '}
      <FormattedMessage id='copy.available' defaultMessage='Available' />
    </DisplayTitle>
  </>
)

export const getIcon = (
  method: SBPaymentMethodType | undefined,
  isSddFlow: boolean = false
): ReactElement => {
  if (isSddFlow && !method) {
    return <Icon size='18px' color='blue600' name='credit-card-sb' />
  }
  if (!method) {
    return (
      <Icon cursor name='plus-in-circle-filled' size='22px' color='blue600' />
    )
  }

  switch (method.type) {
    case 'USER_CARD':
      let cardType = CARD_TYPES.find(
        card => card.type === (method.card ? method.card.type : '')
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
          name={method.currency.toLowerCase() as keyof IcoMoonType}
        />
      )
    case 'BANK_TRANSFER':
      return <Image name={getBankLogoImageName(method.details?.bankName)} />
    default:
      return <></>
  }
}

export const getText = (
  method: SBPaymentMethodType | undefined,
  sbBalances: SBBalancesType,
  isSddFlow: boolean = false
): ReactElement => {
  if (isSddFlow && !method) {
    return (
      <FormattedMessage
        id='modals.simplebuy.confirm.credit_or_debit'
        defaultMessage='Credit or Debit Card'
      />
    )
  }
  if (!method) {
    return (
      <FormattedMessage
        id='modals.simplebuy.confirm.jump_to_payment'
        defaultMessage='Add Payment Method'
      />
    )
  }

  return method.type === 'USER_CARD'
    ? renderCard(method)
    : method.type === 'BANK_TRANSFER'
    ? renderBank(method)
    : renderFund(method, sbBalances)
}
