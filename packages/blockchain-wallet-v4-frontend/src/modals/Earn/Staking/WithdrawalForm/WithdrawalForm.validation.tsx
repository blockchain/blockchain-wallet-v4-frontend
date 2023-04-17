import BigNumber from 'bignumber.js'

import { Exchange } from '@core'
import { convertCoinToFiat } from '@core/exchange'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { DataType, PropsType, RemotePropsType } from './WithdrawalForm.types'

// export const minDepositAmount = (value, allValues, props: ValidationProps) => {
//   if (!value) return true
//   const minDeposit = props.displayCoin
//     ? props.earnDepositLimits.minCoin
//     : props.earnDepositLimits.minFiat
//   return new BigNumber(value).isLessThan(minDeposit) ? 'BELOW_MIN' : false
// }

export const maxWithdrawalAmount = (value, allValues, props: ValidationProps) => {
  const { coin, displayCoin, rates, walletCurrency } = props
  if (!value) return true
  const availToWithdrawCrypto = convertBaseToStandard(coin, props.accountBalance.earningBalance)
  const maxWithdrawalLimit = props.displayCoin
    ? availToWithdrawCrypto
    : convertCoinToFiat({
        coin,
        currency: walletCurrency,
        isStandard: true,
        rates,
        value: availToWithdrawCrypto
      })

  return new BigNumber(maxWithdrawalLimit).isLessThan(value) ? 'ABOVE_MAX' : false
}

type ValidationProps = DataType & PropsType & RemotePropsType
