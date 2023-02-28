import React from 'react'
import { FormattedMessage } from 'react-intl'
import { gt, head, path, prop, propOr } from 'ramda'

import { Remote } from '@core'
import { createDeepEqualSelector } from '@core/utils'
import { model, selectors } from 'data'

const getData = createDeepEqualSelector(
  [
    selectors.core.wallet.isMnemonicVerified,
    selectors.components.sendEth.getPayment,
    selectors.components.sendEth.getIsContract,
    selectors.components.sendEth.getFeeToggled,
    selectors.components.sendEth.getSendLimits,
    (state, coin) => {
      const { coinfig } = window.coins[coin]
      return coinfig.type.erc20Address
        ? selectors.core.data.coins.getCoinUnifiedBalance(coin)(state)
        : selectors.core.data.eth.getCurrentBalance(state)
    },
    (state) => selectors.core.common.eth.getErc20AccountBalances(state, 'PAX').map(head),
    selectors.form.getFormValues(model.components.sendEth.FORM)
  ],
  (
    isMnemonicVerified,
    paymentR,
    isContractR,
    feeToggled,
    sendLimitsR,
    balanceR,
    paxBalanceR,
    formValues
  ) => {
    // TODO: include any/all ERC20 balances in future
    const hasErc20Balance = gt(prop('balance', paxBalanceR.getOrElse(0)), 0)
    const sendLimits = sendLimitsR.getOrElse({})

    const transform = (payment) => {
      const amount = prop('amount', payment)
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const fee = propOr('0', 'fee', payment)
      const from = prop('from', formValues)
      const regularFee = path(['fees', 'regular'], payment)
      const priorityFee = path(['fees', 'priority'], payment)
      const minFee = path(['fees', 'limits', 'min'], payment)
      const maxFee = path(['fees', 'limits', 'max'], payment)
      const isRetryAttempt = path(['isRetryAttempt'], payment)
      const minFeeRequiredForRetry = path(['minFeeRequiredForRetry'], payment)
      const isContractChecked = Remote.Success.is(isContractR)
      const feeElements = [
        {
          group: '',
          items: [
            {
              text: (
                <FormattedMessage
                  id='modals.sendeth.firststep.fee.regular'
                  defaultMessage='Regular'
                />
              ),
              value: regularFee
            },
            {
              text: (
                <FormattedMessage
                  id='modals.sendeth.firststep.fee.priority'
                  defaultMessage='Priority'
                />
              ),
              value: priorityFee
            }
          ]
        }
      ]

      return {
        amount,
        balanceStatus: balanceR,
        effectiveBalance,
        fee,
        feeElements,
        feeToggled,
        from,
        hasErc20Balance,
        isContractChecked,
        isMnemonicVerified,
        isRetryAttempt,
        maxFee,
        minFee,
        minFeeRequiredForRetry,
        priorityFee,
        regularFee,
        sendLimits,
        unconfirmedTx
      }
    }
    return paymentR.map(transform)
  }
)

export default getData
