import { convertCoinToCoin } from '@core/exchange'

import { NftMakeOfferFormValues, Props } from '.'

export const validate = (formValues: NftMakeOfferFormValues, props: Props) => {
  const erc20Balance = props.erc20BalanceR.getOrElse(0)
  const [selfCustodyBalance] = props.ethBalancesR.getOrElse([0, 0])

  // let index.tsx handle this
  if (formValues.coin === 'WETH') {
    return {
      amount: false
    }
  }

  if (formValues.amount) {
    const standardAmt = Number(formValues.amount)
    const standardBalance = Number(
      convertCoinToCoin({ baseToStandard: true, coin: formValues.coin, value: erc20Balance })
    )

    if (standardAmt > standardBalance) {
      return {
        amount: true
      }
    }
  }

  return {
    amount: false
  }
}
