import { createDeepEqualSelector } from 'services/ReselectHelper'
import { FormattedMessage } from 'react-intl'
import { gt, head, includes, isEmpty, path, prop, propOr } from 'ramda'
import { model, selectors } from 'data'
import BigNumber from 'bignumber.js'
import React from 'react'

import { Remote } from 'blockchain-wallet-v4/src'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendEth.getPayment,
    selectors.components.sendEth.getIsContract,
    selectors.components.sendEth.getFeeToggled,
    (state, coin) => {
      const erc20List = selectors.core.walletOptions
        .getErc20CoinList(state)
        .getOrFail()
      return includes(coin, erc20List)
        ? selectors.core.data.eth.getErc20CurrentBalance(state, coin)
        : selectors.core.data.eth.getCurrentBalance(state)
    },
    state => selectors.core.data.eth.getDefaultAddressBalance(state),
    state =>
      selectors.core.common.eth.getErc20AccountBalances(state, 'PAX').map(head),
    selectors.core.kvStore.lockbox.getDevices,
    selectors.form.getFormValues(model.components.sendEth.FORM),
    (state, coin) =>
      selectors.core.walletOptions.getCoinAvailability(state, coin)
  ],
  (
    paymentR,
    isContractR,
    feeToggled,
    balanceR,
    ethBalanceR,
    paxBalanceR,
    lockboxDevicesR,
    formValues,
    coinAvailability
  ) => {
    const enableToggle = !isEmpty(lockboxDevicesR.getOrElse([]))
    const excludeLockbox = !prop('lockbox', coinAvailability.getOrElse({}))
    // TODO: include any/all ERC20 balances in future
    const hasErc20Balance = gt(prop('balance', paxBalanceR.getOrElse(0)), 0)

    const transform = payment => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const fee = propOr('0', 'fee', payment)
      const from = prop('from', formValues)
      const regularFee = path(['fees', 'regular'], payment)
      const priorityFee = path(['fees', 'priority'], payment)
      const minFee = path(['fees', 'limits', 'min'], payment)
      const maxFee = path(['fees', 'limits', 'max'], payment)
      const isSufficientEthForErc20 = new BigNumber(
        ethBalanceR.getOrElse(0)
      ).isGreaterThan(new BigNumber(fee))
      const isContract = isContractR.getOrElse(false)
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
        effectiveBalance,
        unconfirmedTx,
        isContract,
        isContractChecked,
        isSufficientEthForErc20,
        fee,
        feeToggled,
        enableToggle,
        from,
        regularFee,
        priorityFee,
        minFee,
        maxFee,
        feeElements,
        balanceStatus: balanceR,
        hasErc20Balance,
        excludeLockbox
      }
    }
    return paymentR.map(transform)
  }
)
