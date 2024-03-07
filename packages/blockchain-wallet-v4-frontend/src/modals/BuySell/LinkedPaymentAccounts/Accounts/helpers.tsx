import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { BSPaymentMethodType, BSPaymentTypes, WalletCurrencyType } from '@core/types'
import { Icon, Image } from 'blockchain-info-components'
import { getBankLogoImageName } from 'services/images'

import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from '../../PaymentMethods/model'
import { IconContainer } from './AccountsStyles'

export const getType = (value: BSPaymentMethodType) => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
      return (
        <FormattedMessage
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      )
    case BSPaymentTypes.BANK_ACCOUNT:
      return value.currency === 'USD' ? (
        <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      ) : (
        <FormattedMessage
          id='modals.simplebuy.deposit.regular_bank_transfer'
          defaultMessage='Regular Bank Transfer'
        />
      )
    case BSPaymentTypes.PAYMENT_CARD:
      return (
        <FormattedMessage id='modals.simplebuy.paymentcard' defaultMessage='Credit or Debit Card' />
      )
    case BSPaymentTypes.USER_CARD:
      if (!value?.card)
        return (
          <FormattedMessage
            id='modals.simplebuy.paymentcard'
            defaultMessage='Credit or Debit Card'
          />
        )

      return value.card?.label ?? value.card.type
    case BSPaymentTypes.FUNDS:
    default:
      return ''
  }
}

export const getIcon = (value: BSPaymentMethodType): ReactElement => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
      return <Image name='bank' height='48px' />
    case BSPaymentTypes.BANK_ACCOUNT:
      return (
        <IconContainer>
          <Icon size='18px' color='blue600' name='arrow-down' />
        </IconContainer>
      )
    case BSPaymentTypes.PAYMENT_CARD:
      return (
        <IconContainer>
          <Icon size='18px' color='blue600' name='credit-card-sb' />
        </IconContainer>
      )
    case BSPaymentTypes.USER_CARD: {
      const { card } = value
      if (!card) {
        return <></>
      }
      const cardType = CARD_TYPES.find((cc) => cc.type === card.type)
      return (
        <img
          alt='Credit Card Type'
          height='18px'
          width='auto'
          src={cardType?.logo ?? DEFAULT_CARD_SVG_LOGO}
        />
      )
    }
    case BSPaymentTypes.FUNDS:
      return <Icon size='32px' color='USD' name={value.currency as WalletCurrencyType} />
    default:
      return <Image name='blank-card' />
  }
}

export const getLinkedBankIcon = (bankName: string): ReactElement => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

export const renderBankText = (value: BSPaymentMethodType): string | ReactElement => {
  if (value.details) {
    return value.details.bankName ?? value.details.accountNumber
  }
  return <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
}

export const renderCardText = ({ card }: BSPaymentMethodType): string => {
  if (!card) return 'Credit or Debit Card'
  return card.label ?? card.type
}
