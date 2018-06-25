import React from 'react'
import { FormattedMessage } from 'react-intl'
import { equals, length, prop, path } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendBtc.getToToggled,
    selectors.components.sendBtc.getFeePerByteToggled,
    selectors.components.sendBtc.getPayment,
    selectors.core.common.btc.getActiveHDAccounts,
    selectors.core.common.btc.getActiveAddresses,
    selectors.form.getFormValues('sendBtc')
  ],
  (toToggled, feePerByteToggled, paymentR, btcAccountsR, btcAddressesR, formValues) => {
    const btcAccountsLength = length(btcAccountsR.getOrElse([]))
    const btcAddressesLength = length(btcAddressesR.getOrElse([]))
    const enableToggle = btcAccountsLength + btcAddressesLength > 1
    const feePerByte = prop('feePerByte', formValues)
    const destination = prop('to', formValues)
    const from = prop('from', formValues)

    const transform = payment => {
      const regularFeePerByte = path(['fees', 'regular'], payment)
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      const totalFee = path(['selection', 'fee'], payment) || '0'
      const effectiveBalance = prop('effectiveBalance', payment)
      const feePerByteElements =
      [{ group: '',
        items: [
          { text: <FormattedMessage id='modals.sendbtc.firststep.fee.regular' defaultMessage='Regular' />,
            value: regularFeePerByte
          },
          { text: <FormattedMessage id='modals.sendbtc.firststep.fee.priority' defaultMessage='Priority' />,
            value: priorityFeePerByte
          }
        ]
      }]
      const watchOnly = prop('watchOnly', from)
      const addressMatchesPriv = payment.fromType === 'FROM.WATCH_ONLY'
      const isPriorityFeePerByte = equals(parseInt(feePerByte), priorityFeePerByte)

      return {
        from,
        toToggled,
        enableToggle,
        feePerByteToggled,
        feePerByteElements,
        effectiveBalance,
        minFeePerByte,
        maxFeePerByte,
        regularFeePerByte,
        priorityFeePerByte,
        isPriorityFeePerByte,
        destination,
        totalFee,
        watchOnly,
        addressMatchesPriv
      }
    }

    return paymentR.map(transform)
  }
)

export const getBtcData = selectors.core.common.btc.getHDAccounts
