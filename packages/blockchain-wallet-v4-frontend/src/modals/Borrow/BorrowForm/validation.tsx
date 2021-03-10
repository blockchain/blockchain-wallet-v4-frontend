import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { model } from 'data'
import { BorrowFormValuesType, BorrowSteps } from 'data/types'

import { Props as AddCollateralProps } from '../AddCollateral/template.success'
import { Props as CheckoutProps } from './template.success'

const {
  getCollateralAmtRequired,
  getCollateralizationDisplayName
} = model.components.borrow

export const maximumAmount = (
  value: string,
  allValues: BorrowFormValuesType,
  props:
    | ({ step: BorrowSteps.CHECKOUT } & CheckoutProps)
    | ({ step: BorrowSteps.ADD_COLLATERAL } & AddCollateralProps)
) => {
  return new BigNumber(props.limits.maxFiat).isLessThan(Number(value)) ? (
    <FormattedMessage
      id='borrow.validation.abovemax'
      defaultMessage='The amount you entered is above the maximum amount.'
    />
  ) : (
    false
  )
}

export const minimumAmount = (
  value: string,
  allValues: BorrowFormValuesType,
  props:
    | ({ step: 'CHECKOUT' } & CheckoutProps)
    | ({ step: 'ADD_COLLATERAL' } & AddCollateralProps)
) => {
  if (!value) return true
  switch (props.step) {
    case 'CHECKOUT':
      return new BigNumber(value).isLessThan(props.limits.minFiat) ? (
        <FormattedMessage
          id='borrow.validation.belowmin.amt'
          defaultMessage='The amount you entered is below the minimum amount of {minFiat}.'
          values={{
            minFiat: fiatToString({
              value: props.limits.minFiat,
              unit: 'USD'
            })
          }}
        />
      ) : (
        false
      )
    case 'ADD_COLLATERAL':
      const collateralisationStatus = getCollateralizationDisplayName(
        props.loan.collateralisationRatio,
        props.offer
      )

      switch (collateralisationStatus) {
        case 'risky':
        case 'unsafe':
          return new BigNumber(value).isLessThan(
            getCollateralAmtRequired(props.loan, props.offer)
          ) ? (
            <FormattedMessage
              id='borrow.validation.belowmin.amt'
              defaultMessage='The amount you entered is below the minimum amount of {minFiat}.'
              values={{
                minFiat: fiatToString({
                  value: getCollateralAmtRequired(props.loan, props.offer),
                  unit: 'USD'
                })
              }}
            />
          ) : (
            false
          )
        default:
          return new BigNumber(value).isLessThanOrEqualTo(0) ? (
            <FormattedMessage
              id='borrow.validation.belowmin.safe'
              defaultMessage='You must enter an amount greater than {minFiat}.'
              values={{
                minFiat: fiatToString({
                  value: 0,
                  unit: 'USD'
                })
              }}
            />
          ) : (
            false
          )
      }
  }
}
