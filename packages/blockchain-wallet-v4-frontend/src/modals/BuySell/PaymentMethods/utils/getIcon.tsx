import React from 'react'
import styled from 'styled-components'

import { BSPaymentMethodType, BSPaymentTypes, WalletCurrencyType } from '@core/types'
import { Icon, Image } from 'blockchain-info-components'

import { getCardLogoOrDefault } from '../model'

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const getIcon = (value: BSPaymentMethodType | { type: BSPaymentTypes.BANK_TRANSFER }) => {
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
      if (!card) return <></>

      return (
        <img
          alt='Credit Card Logo'
          height='18px'
          width='auto'
          src={getCardLogoOrDefault(card.type)}
        />
      )
    }
    case BSPaymentTypes.FUNDS:
      return <Icon size='32px' color='USD' name={value.currency as WalletCurrencyType} />
    default:
      return <Image name='blank-card' />
  }
}
