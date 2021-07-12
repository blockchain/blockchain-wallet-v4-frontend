import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  FiatType,
  SBBalancesType,
  SBPaymentMethodType,
  SBPaymentTypes,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { Title, Value } from 'components/Flyout'
import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankTransferAccountType } from 'data/types'
import { getBankLogoImageName } from 'services/images'

type PaymentContainerProps = {
  disabled?: boolean
  isMethod: boolean
}

const DisablableIcon = styled(Icon)<{
  disabled?: boolean
}>`
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

export const PaymentText = styled(Text)<PaymentContainerProps>`
  flex: 1;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  ${(props) =>
    !props.isMethod &&
    css`
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 35px;
    `}
`
export const PaymentArrowContainer = styled.div<{
  disabled?: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`
export const DisplayTitle = styled(Title)`
  margin-top: 4px;
  text-transform: capitalize;
  color: ${(p) => p.theme.grey600};
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

export const renderBankText = (
  value: SBPaymentMethodType | BankTransferAccountType
): string | ReactElement => {
  return value.details ? (
    value.details.bankName ? (
      value.details.bankName
    ) : (
      value.details.accountNumber
    )
  ) : (
    <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
  )
}

export const renderBank = (value: SBPaymentMethodType | BankTransferAccountType) => (
  <>
    <DisplayValue>{renderBankText(value)}</DisplayValue>
    <DisplayTitle>
      {`${value.details?.bankAccountType?.toLowerCase() || ''} account ${
        value.details?.accountNumber || ''
      }`}
    </DisplayTitle>
  </>
)

export const renderCardText = (value: SBPaymentMethodType): string => {
  return value.card
    ? value.card.label
      ? value.card.label.toLowerCase()
      : value.card.type
    : 'Credit or Debit Card'
}

export const renderCard = (value: SBPaymentMethodType) => (
  <>
    <DisplayValue capitalize>{renderCardText(value)}</DisplayValue>
    <DisplayTitle>
      {value.card ? (
        <FormattedMessage
          id='modals.simplebuy.card_ending_in'
          defaultMessage='Card Ending in {lastFour}'
          values={{
            lastFour: value.card.number
          }}
        />
      ) : (
        <FormattedMessage id='modals.simplebuy.paymentcard' defaultMessage='Credit or Debit Card' />
      )}
    </DisplayTitle>
  </>
)

export const renderFund = (value: SBPaymentMethodType, sbBalances: SBBalancesType) => (
  <>
    <DisplayValue>{value.currency}</DisplayValue>
    <DisplayTitle>
      {fiatToString({
        unit: value.currency as FiatType,
        value: convertBaseToStandard('FIAT', sbBalances[value.currency]?.available || '0')
      })}{' '}
      <FormattedMessage id='copy.available' defaultMessage='Available' />
    </DisplayTitle>
  </>
)

export const getIcon = (
  method: SBPaymentMethodType | undefined,
  isSddFlow = false,
  disabled?: boolean
): ReactElement => {
  if (isSddFlow && !method) {
    return <DisablableIcon disabled={disabled} size='18px' color='blue600' name='credit-card-sb' />
  }
  if (!method) {
    return (
      <DisablableIcon
        cursor
        disabled={disabled}
        name='plus-in-circle-filled'
        size='22px'
        color='blue600'
      />
    )
  }

  switch (method.type) {
    case SBPaymentTypes.USER_CARD:
      const cardType = CARD_TYPES.find(
        (card) => card.type === (method.card ? method.card.type : '')
      )
      return (
        <img
          height='18px'
          width='auto'
          src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          alt=''
        />
      )
    case SBPaymentTypes.FUNDS:
      return <Icon size='32px' color='USD' name={method.currency as WalletCurrencyType} />
    case SBPaymentTypes.BANK_TRANSFER:
      return <Image name={getBankLogoImageName(method.details?.bankName)} height='48px' />
    default:
      return <></>
  }
}

export const getText = (
  method: SBPaymentMethodType | undefined,
  sbBalances: SBBalancesType,
  isSddFlow = false
): ReactElement => {
  if (isSddFlow && !method) {
    return (
      <Text weight={600} color='grey900' style={{ paddingBottom: '3px', paddingTop: '4px' }}>
        <FormattedMessage
          id='modals.simplebuy.confirm.credit_or_debit'
          defaultMessage='Credit or Debit Card'
        />
      </Text>
    )
  }
  if (!method) {
    return (
      <Text weight={600} color='grey900' style={{ paddingBottom: '3px', paddingTop: '4px' }}>
        <FormattedMessage
          id='modals.simplebuy.confirm.jump_to_payment'
          defaultMessage='Add Payment Method'
        />
      </Text>
    )
  }

  return method.type === SBPaymentTypes.USER_CARD
    ? renderCard(method)
    : method.type === SBPaymentTypes.BANK_TRANSFER
    ? renderBank(method)
    : renderFund(method, sbBalances)
}
