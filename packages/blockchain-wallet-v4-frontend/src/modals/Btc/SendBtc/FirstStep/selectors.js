import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as Bitcoin from 'bitcoinjs-lib'
import { length, path, pathOr, prop } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { model, selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendBtc.getFeePerByteToggled,
    selectors.components.sendBtc.getPayment,
    selectors.core.common.btc.getActiveHDAccounts,
    selectors.core.common.btc.getActiveAddresses,
    selectors.core.wallet.isMnemonicVerified,
    selectors.form.getFormValues(model.components.sendBtc.FORM)
  ],
  (feePerByteToggled, paymentR, btcAccountsR, btcAddressesR, isMnemonicVerified, formValues) => {
    const btcAccountsLength = length(btcAccountsR.getOrElse([]))
    const btcAddressesLength = length(btcAddressesR.getOrElse([]))
    const networkType = 'bitcoin'
    const enableToggle = btcAccountsLength + btcAddressesLength > 1
    const amount = prop('amount', formValues)
    const feePerByte = prop('feePerByte', formValues)
    const destination = prop('to', formValues)
    const from = prop('from', formValues)

    const transform = (payment) => {
      const regularFeePerByte = path(['fees', 'regular'], payment)
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      const totalFee = pathOr('0', ['selection', 'fee'], payment)
      const effectiveBalance = prop('effectiveBalance', payment)
      const feePerByteElements = [
        {
          group: '',
          items: [
            {
              text: (
                <FormattedMessage
                  id='modals.sendbtc.firststep.fee.regular'
                  defaultMessage='Regular'
                />
              ),
              value: regularFeePerByte
            },
            {
              text: (
                <FormattedMessage
                  id='modals.sendbtc.firststep.fee.priority'
                  defaultMessage='Priority'
                />
              ),
              value: priorityFeePerByte
            }
          ]
        }
      ]
      const network = Bitcoin.networks[networkType]

      return {
        amount,
        destination,
        effectiveBalance,
        enableToggle,
        feePerByte,
        feePerByteElements,
        feePerByteToggled,
        from,
        isMnemonicVerified,
        maxFeePerByte,
        minFeePerByte,
        network,
        priorityFeePerByte,
        regularFeePerByte,
        totalFee
      }
    }

    return paymentR.map(transform)
  }
)

export const getBtcData = selectors.core.common.btc.getHDAccounts
