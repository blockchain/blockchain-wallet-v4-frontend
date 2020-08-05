import { CoinType, SBOrderActionType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import React from 'react'

export const BuyOrSellCrypto = (props: {
  actionType: SBOrderActionType
  crypto?: CoinType
}) => {
  return props.actionType === 'BUY' ? (
    <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
  ) : (
    <FormattedMessage id='buttons.sell_crypto' defaultMessage='Sell Crypto' />
  )
}
