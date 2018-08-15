import React from 'react'
import { FormattedMessage } from 'react-intl'
import { prop, propOr, path } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendEth.getPayment,
    selectors.components.sendEth.getFeeToggled,
    selectors.core.data.ethereum.getLegacyBalance
  ],
  (paymentR, feeToggled, balanceR) => {
    const transform = payment => {
      const effectiveBalance = propOr(
        '0',
        'effectiveBalance',
        payment
      )
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const isContract = prop('isContract', payment)
      const fee = propOr('0', 'fee', payment)
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
        feeToggled,
        regularFee,
        priorityFee,
        minFee,
        maxFee,
        feeElements,
        balanceStatus: balanceR
      }
    }
    return paymentR.map(transform)
  }
)
