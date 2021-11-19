import React from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertButton } from 'blockchain-wallet-v4-frontend/src/modals/components'

import { fiatToString } from '@core/exchange/utils'
import { CrossBorderLimits, FiatType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BrokerageOrderType } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'

export const minMaxAmount = (
  limits: { max: string; min: string },
  orderType: BrokerageOrderType,
  fiatCurrency: FiatType,
  amount: string
) => {
  const max = convertBaseToStandard('FIAT', limits.max)
  const min = convertBaseToStandard('FIAT', limits.min)
  const formattedMax = fiatToString({
    unit: fiatCurrency,
    value: max
  })
  const formattedMin = fiatToString({
    unit: fiatCurrency,
    value: min
  })

  // This handles the default case where we show "0" in the input field but
  // it's just a placeholder and amount actuall equals '' in redux
  if (amount === '') return undefined
  // The min max logic
  if (Number(amount) > Number(max)) {
    return {
      amount: (
        <>
          <AlertButton>
            {orderType === BrokerageOrderType.DEPOSIT ? (
              <FormattedMessage
                id='copy.above_max'
                defaultMessage='{amount} Maximum'
                values={{
                  amount: formattedMax
                }}
              />
            ) : (
              <FormattedMessage
                id='copy.not_enough_coin'
                defaultMessage='Not Enough {coin}'
                values={{
                  coin: fiatCurrency
                }}
              />
            )}
          </AlertButton>
          {orderType === BrokerageOrderType.WITHDRAW && (
            <Text
              size='14px'
              color='textBlack'
              weight={500}
              style={{ marginTop: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='modals.brokerage.withdraw_limit_max'
                defaultMessage='The maximum amount of {currency} you can withdraw from this account is {amount}'
                values={{
                  amount: formattedMax,
                  currency: fiatCurrency
                }}
              />
            </Text>
          )}
        </>
      )
    }
  }
  if (Number(amount) < Number(min)) {
    return {
      amount: (
        <>
          <AlertButton>
            <FormattedMessage
              id='copy.below_min'
              defaultMessage='{amount} Minimum'
              values={{
                amount: formattedMin
              }}
            />
          </AlertButton>
          {orderType === BrokerageOrderType.WITHDRAW && (
            <FormattedMessage
              id='modals.brokerage.withdraw_limit_min'
              defaultMessage='To offset fees, the minimum amount for any withdrawal is {amount} {currency}.'
              values={{
                amount: formattedMin,
                currency: fiatCurrency
              }}
            />
          )}
        </>
      )
    }
  }
}

export const checkCrossBorderLimit = (
  crossBorderLimits: CrossBorderLimits,
  amount: string,
  orderType: BrokerageOrderType,
  fiatCurrency: FiatType,
  bankText: string
) => {
  if (!crossBorderLimits?.current) {
    return false
  }

  const { value: availableAmount } = crossBorderLimits?.current?.available
  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  const showError = Number(amount) > Number(availableAmountInBase)

  if (!showError) {
    return false
  }

  if (orderType === BrokerageOrderType.WITHDRAW) {
    const effectiveLimit = getEffectiveLimit(crossBorderLimits)
    return {
      amount: (
        <>
          <AlertButton>
            <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
          </AlertButton>
          <Text
            size='14px'
            color='textBlack'
            weight={600}
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='modals.brokerage.withdraw_limit'
              defaultMessage='Withdrawing from Trade Accounts cannot exceed {limit} a {time}. You have {remaining} remaining.'
              values={{
                limit: effectiveLimit?.limit.value,
                remaining: availableAmountInBase,
                time: getEffectivePeriod(crossBorderLimits)
              }}
            />
          </Text>
        </>
      )
    }
  }

  if (orderType === BrokerageOrderType.DEPOSIT) {
    const formattedAmount = fiatToString({
      unit: fiatCurrency,
      value: amount
    })
    return {
      amount: (
        <>
          <AlertButton>
            <FormattedMessage
              id='copy.above_max'
              defaultMessage='{amount} Maximum'
              values={{
                amount: availableAmountInBase
              }}
            />
          </AlertButton>
          <Text
            size='14px'
            color='textBlack'
            weight={600}
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='modals.brokerage.deposit_limit'
              defaultMessage='Looks like your {bank} only allows deposits up to {maxAmount} at at time. To deposit {enterAmount}, split your deposit into multiple transactions.'
              values={{
                bank: bankText,
                enterAmount: formattedAmount,
                maxAmount: availableAmountInBase
              }}
            />
          </Text>
        </>
      )
    }
  }
}
