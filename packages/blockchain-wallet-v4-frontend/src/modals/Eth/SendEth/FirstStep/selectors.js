import React from 'react'
import { FormattedMessage } from 'react-intl'
import { prop, propOr, path, includes, isEmpty } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendEth.getPayment,
    selectors.components.sendEth.getToToggled,
    selectors.components.sendEth.getFeeToggled,
    (state, coin) => {
      const erc20List = selectors.core.walletOptions
        .getErc20CoinList(state)
        .getOrFail()
      return includes(coin, erc20List)
        ? selectors.core.data.eth.getErc20CurrentBalance(state, coin)
        : selectors.core.data.eth.getCurrentBalance(state)
    },
    selectors.core.kvStore.lockbox.getDevices,
    selectors.form.getFormValues(model.components.sendEth.FORM),
    (state, coin) =>
      selectors.core.walletOptions.getCoinAvailability(state, coin)
  ],
  (
    paymentR,
    toToggled,
    feeToggled,
    balanceR,
    lockboxDevicesR,
    formValues,
    coinAvailability
  ) => {
    const enableToggle = !isEmpty(lockboxDevicesR.getOrElse([]))
    const excludeLockbox = !prop('lockbox', coinAvailability.getOrElse({}))

    const transform = payment => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const isContract = prop('isContract', payment)
      const fee = propOr('0', 'fee', payment)
      const destination = prop('to', formValues)
      const from = prop('from', formValues)
      const regularFee = path(['fees', 'regular'], payment)
      const priorityFee = path(['fees', 'priority'], payment)
      const minFee = path(['fees', 'limits', 'min'], payment)
      const maxFee = path(['fees', 'limits', 'max'], payment)
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
        fee,
        toToggled,
        feeToggled,
        enableToggle,
        destination,
        from,
        regularFee,
        priorityFee,
        minFee,
        maxFee,
        feeElements,
        balanceStatus: balanceR,
        excludeLockbox
      }
    }
    return paymentR.map(transform)
  }
)
