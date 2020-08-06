import { CoinType, SBOrderActionType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import React from 'react'

export const BuyOrSellCrypto = (props: {
  crypto?: CoinType
  orderType: SBOrderActionType
}) => {
  return props.orderType === 'BUY' ? (
    <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
  ) : (
    <FormattedMessage id='buttons.sell_crypto' defaultMessage='Sell Crypto' />
  )
}
